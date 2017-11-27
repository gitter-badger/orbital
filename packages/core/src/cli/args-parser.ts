import { buildCastingContext, cast, CastableType, Context } from "../object";
import { GeneralValidator } from "../validation";
import { ParamsDefinition } from '../params';
import { OptionDefinition } from '../option';
import { ParamDefinition } from '../param';
import { ParsedArgs } from "./parsed-args";
import { Executable } from '../command';
import { HelpProvider } from "../help";
import { UsageError } from "../error";

export class ArgsParser {
  private helpProvider: HelpProvider;

  private paramDefinitions: ParamDefinition<any>[];
  private requiredParamsNumber: number;

  private paramsDefinition: ParamsDefinition<any>;

  private optionDefinitionMap: Map<string, OptionDefinition<any>>;
  private optionFlagMapping: Map<string, string>;

  private optionsConstructor: Orbital.Constructor<Orbital.Dictionary<any>>;
  private optionDefinitions: OptionDefinition<any>[];

  private contextConstructor: typeof Context;

  constructor(command: typeof Executable) {
    this.helpProvider = command;

    this.paramDefinitions = command.paramDefinitions;
    this.requiredParamsNumber = command.requiredParamsNumber;

    this.paramsDefinition = command.paramsDefinition;

    this.optionsConstructor = command.optionsConstructor;
    this.optionDefinitions = command.optionDefinitions;

    this.contextConstructor = command.contextConstructor;

    if (this.optionDefinitions) {
      this.optionFlagMapping = new Map<string, string>();
      this.optionDefinitionMap = new Map<string, OptionDefinition<any>>();

      for (const definition of this.optionDefinitions) {
        const {
          name,
          flag,
        } = definition;

        this.optionDefinitionMap.set(name, definition);

        if (flag) {
          this.optionFlagMapping.set(flag, name);
        }
      }
    }
  }

  async parse(
    sequence: string[],
    args: string[],
    cwd: string,
    contextExtension: object | undefined,
  ): Promise<ParsedArgs | undefined> {
    const that = this;

    const ContextConstructor: Orbital.Constructor<Context> = this.contextConstructor || Context;
    const context = new ContextConstructor(
      {
        commands: sequence,
        cwd,
      },
      contextExtension,
    );

    args = args.concat();

    const OptionConstructor = this.optionsConstructor;
    const optionDefinitions = this.optionDefinitions;
    const optionDefinitionMap = this.optionDefinitionMap || new Map<string, OptionDefinition<any>>();
    const optionFlagMapping = this.optionFlagMapping || new Map<string, string>();
    let requiredOptionSet: Set<string> | undefined;

    const paramDefinitions = this.paramDefinitions || [];
    const pendingParamDefinitions = paramDefinitions.concat();

    const paramsDefinition = this.paramsDefinition;
    const argsNumber = args.length;

    const commandArgs = [] as any[];
    const commandExtraArgs = paramsDefinition && [] as any[];
    let commandOptions: Orbital.Dictionary<any> | undefined;

    if (OptionConstructor) {
      commandOptions = new OptionConstructor();
      requiredOptionSet = new Set<string>();

      for (const definition of optionDefinitions) {
        const {
          name,
          key,
          type,
          required,
          validators,
          toggle,
          default: defaultValue,
        } = definition;

        if (required) {
          requiredOptionSet.add(name);
        }

        if (toggle) {
          commandOptions[key] = false;
        } else {
          commandOptions[key] = typeof defaultValue === 'string' ?
            await castArgument(defaultValue, name, type, validators, true) :
            defaultValue;
        }
      }
    }

    while (args.length) {
      const arg = args.shift() as string;

      if (
        arg === '-?' ||
        (arg === '-h' && !optionFlagMapping.has('h')) ||
        (arg === '--help' && !optionDefinitionMap.has('help'))
      ) {
        return undefined;
      }

      if (arg[0] === '-' && isNaN(Number(arg))) {
        if (arg[1] === '-') {
          await consumeToggleOrOption(arg.substr(2));
        } else {
          await consumeFlags(arg.substr(1));
        }
      } else if (pendingParamDefinitions.length) {
        const definition = pendingParamDefinitions.shift() as ParamDefinition<any>;
        const casted = await castArgument(
          arg,
          definition.name,
          definition.type,
          definition.validators,
          false,
        );
        commandArgs.push(casted);
      } else if (paramsDefinition) {
        const casted = await castArgument(
          arg,
          paramsDefinition.name,
          paramsDefinition.type,
          paramsDefinition.validators,
          false,
        );
        commandExtraArgs.push(casted);
      } else {
        throw new UsageError(
          `Expecting ${paramDefinitions.length} parameter(s) at most but got ${argsNumber} instead`,
          this.helpProvider,
        );
      }
    }

    {
      const expecting = this.requiredParamsNumber;
      const got = commandArgs.length;

      if (got < expecting) {
        const missingArgNames = pendingParamDefinitions
          .slice(0, expecting - got)
          .map(definition => `\`${definition.name}\``);

        throw new UsageError(`Expecting parameter(s) ${missingArgNames.join(', ')}`, this.helpProvider);
      }
    }

    const missingOptionNames = requiredOptionSet && Array.from(requiredOptionSet);

    if (missingOptionNames && missingOptionNames.length) {
      throw new UsageError(`Missing required option(s) \`${missingOptionNames.join('`, `')}\``, this.helpProvider);
    }

    for (const definition of pendingParamDefinitions) {
      const defaultValue = definition.default;

      const value = typeof defaultValue === 'string' ?
        await castArgument(defaultValue, definition.name, definition.type, definition.validators, true) :
        defaultValue;

      commandArgs.push(value);
    }

    if (
      paramsDefinition &&
      paramsDefinition.required &&
      !commandExtraArgs.length
    ) {
      throw new UsageError(
        `Expecting at least one element for variadic parameters \`${paramsDefinition.name}\``,
        this.helpProvider,
      );
    }

    return {
      args: commandArgs,
      context: this.contextConstructor ? context : undefined,
      extraArgs: paramsDefinition && commandExtraArgs,
      options: commandOptions,
    };

    async function consumeFlags(flags: string): Promise<void> {
      for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];

        if (!optionFlagMapping.has(flag)) {
          throw new UsageError(`Unknown option flag "${flag}"`, that.helpProvider);
        }

        const name = optionFlagMapping.get(flag)!;
        const definition = optionDefinitionMap.get(name)!;

        if (definition.required) {
          requiredOptionSet!.delete(name);
        }

        if (definition.toggle) {
          commandOptions![definition.key] = true;
        } else {
          if (i !== flags.length - 1) {
            throw new UsageError(
              'Only the last flag in a sequence can refer to an option instead of a toggle',
              that.helpProvider,
            );
          }

          await consumeOption(definition);
        }
      }
    }

    async function consumeToggleOrOption(name: string): Promise<void> {
      if (!optionDefinitionMap.has(name)) {
        throw new UsageError(`Unknown option \`${name}\``, that.helpProvider);
      }

      const definition = optionDefinitionMap.get(name)!;

      if (definition.required) {
        requiredOptionSet!.delete(name);
      }

      if (definition.toggle) {
        commandOptions![definition.key] = true;
      } else {
        await consumeOption(definition);
      }
    }

    async function consumeOption(definition: OptionDefinition<any>): Promise<void> {
      const {
        name,
        key,
        type,
        validators,
      } = definition;

      const arg = args.shift();

      if (arg === undefined) {
        throw new UsageError(`Expecting value for option \`${name}\``, that.helpProvider);
      }

      if (arg[0] === '-' && isNaN(Number(arg))) {
        throw new UsageError(
          `Expecting a value instead of an option or toggle "${arg}" for option \`${name}\``,
          that.helpProvider,
        );
      }

      commandOptions![key] = await castArgument(arg, name, type, validators, false);
    }

    async function castArgument(
      arg: string,
      name: string,
      type: CastableType<any>,
      validators: GeneralValidator<any>[],
      usingDefault: boolean,
    ): Promise<any> {
      const castingContext = buildCastingContext(context, {
        default: usingDefault,
        name,
        validators,
      });

      return await cast(arg, type, castingContext);
    }
  }
}
