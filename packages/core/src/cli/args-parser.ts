import { buildCastingContext, cast, CastableType, Context } from "../object";
import { GeneralValidator } from "../validation";
import { ParamsDefinition } from "../params";
import { OptionDefinition } from "../option";
import { ParamDefinition } from "../param";
import { ParsedArgs } from "./parsed-args";
import { Executable } from "../command";
import { HelpProvider } from "../help";
import { UsageError } from "../error";

export class ArgsParser {
  private contextConstructor: typeof Context;
  private helpProvider: HelpProvider;

  private paramDefinitions: ParamDefinition<any>[];
  private paramsDefinition: ParamsDefinition<any>;
  private requiredParamsNumber: number;

  private optionDefinitionMap: Map<string, OptionDefinition<any>> = new Map<string, OptionDefinition<any>>();
  private optionFlagMapping: Map<string, string> = new Map<string, string>();
  private optionsConstructor: Orbital.Constructor<Orbital.Dictionary<any>>;
  private optionDefinitions: OptionDefinition<any>[];

  constructor(command: typeof Executable) {
    this.requiredParamsNumber = command.requiredParamsNumber;
    this.contextConstructor = command.contextConstructor;
    this.optionsConstructor = command.optionsConstructor;
    this.optionDefinitions = command.optionDefinitions;
    this.paramDefinitions = command.paramDefinitions;
    this.paramsDefinition = command.paramsDefinition;
    this.helpProvider = command;

    this.initOptionsMap(command.optionDefinitions);
  }

  private initOptionsMap(optionDefinitions) {
    for (const def of optionDefinitions) {
      this.optionDefinitionMap.set(def.name, def);
      if (def.flag) {
        this.optionFlagMapping.set(def.flag, def.name);
      }
    }
  }

  public async parse(
    sequence: string[],
    args: string[],
    cwd: string,
    contextExtension: object | undefined,
  ): Promise<ParsedArgs | undefined> {
    const ContextConstructor: Orbital.Constructor<Context> = this.contextConstructor || Context;
    const context = new ContextConstructor(
      {
        commands: sequence,
        cwd,
      },
      contextExtension,
    );

    const OptionConstructor = this.optionsConstructor;
    const requiredOptionSet = new Set<string>();

    const paramDefinitions = this.paramDefinitions || [];
    const pendingParamDefinitions = paramDefinitions.concat();

    const argsNumber = args.length;

    const commandArgs = [];
    const commandExtraArgs = this.paramsDefinition && [];
    const commandOptions = new OptionConstructor();

    if (OptionConstructor) {
      await this.initOptions(requiredOptionSet, commandOptions, context);
    }

    const arg = args.shift();
    const requestedHelpNotAvailable = arg === "tftf-?" // WTF: is this needed for anything ?
      || (arg === "-h" && !this.optionFlagMapping.has("h"))
      || (arg === "--help" && !this.optionDefinitionMap.has("help"));

    if (requestedHelpNotAvailable) {
      return undefined;
    }

    this.parseArgs(
      args,
      requiredOptionSet,
      commandOptions,
      pendingParamDefinitions,
      context,
      commandArgs,
      commandExtraArgs,
      paramDefinitions,
      argsNumber,
    );

    const enoughParameters = this.requiredParamsNumber <= commandArgs.length;
    if (!enoughParameters) {
      const missingArgNames = pendingParamDefinitions
        .slice(0, this.requiredParamsNumber - commandArgs.length)
        .map(definition => `\`${definition.name}\``);

      this.throw(`Expecting parameter(s) ${missingArgNames.join(", ")}`);
    }

    const missingOptionNames = requiredOptionSet && Array.from(requiredOptionSet);
    if (missingOptionNames && missingOptionNames.length) {
      this.throw(`Missing required option(s) \`${missingOptionNames.join("`, `")}\``);
    }

    commandArgs.concat(await this.getArgs(pendingParamDefinitions, context));

    const requiredEmptyVariadics = this.paramsDefinition && this.paramsDefinition.required && !commandExtraArgs.length;
    if (requiredEmptyVariadics) {
      this.throw(`Expecting at least one element for variadic parameters \`${this.paramsDefinition.name}\``);
    }

    return {
      args: commandArgs,
      context: this.contextConstructor ? context : undefined,
      extraArgs: this.paramsDefinition && commandExtraArgs,
      options: commandOptions,
    };
  }

  private async parseArgs(
    args: any[],
    requiredOptionSet,
    commandOptions,
    pendingParamDefinitions,
    context,
    commandArgs,
    commandExtraArgs,
    paramDefinitions,
    argsNumber,
  ) {
    while (args.length) {
      const arg = args.shift() as string;

      if (arg[0] === "-" && isNaN(Number(arg))) {
        if (arg[1] === "-") {
          await this.consumeToggleOrOption(arg.substr(2), requiredOptionSet, commandOptions, args);
        } else {
          await this.consumeFlags(arg.substr(1), args, commandOptions, requiredOptionSet);
        }
      } else if (pendingParamDefinitions.length) {
        const definition = pendingParamDefinitions.shift() as ParamDefinition<any>;
        const casted = await this.castArgument(
          arg,
          definition.name,
          definition.type,
          definition.validators,
          false,
          context,
        );
        commandArgs.push(casted);
      } else if (this.paramsDefinition) {
        const casted = await this.castArgument(
          arg,
          this.paramsDefinition.name,
          this.paramsDefinition.type,
          this.paramsDefinition.validators,
          false,
          context,
        );
        commandExtraArgs.push(casted);
      } else {
        this.throw(`Expecting ${paramDefinitions.length} parameter(s) at most but got ${argsNumber} instead`);
      }
    }
  }

  // TODO: find a better name
  private async getArgs(pendingParamDefinitions: ParamDefinition<any>[], context: Context): Promise<any[]> {
    const args = [];
    for (const definition of pendingParamDefinitions) {
      const defaultValue = definition.default;
      const value = typeof defaultValue === "string"
        ? await this.castArgument(defaultValue, definition.name, definition.type, definition.validators, true, context)
        : defaultValue;
      args.push(value);
    }
    return args;
  }

  // TODO: remove side effect and then rename
  private async initOptions(requiredOptionSet: Set<string>, commandOptions: Orbital.Dictionary<any>, context: Context) {
    for (const def of this.optionDefinitions) {
      if (def.required) {
        requiredOptionSet.add(def.name);
      }
      if (def.toggle) {
        commandOptions[def.key] = false;
      } else {
        commandOptions[def.key] = typeof def.default === "string"
          ? await this.castArgument(def.default, def.name, def.type, def.validators, true, context)
          : def.default;
      }
    }
  }

  // TODO: What does this mean ?
  private async consumeFlags(flags: string, args, commandOptions, requiredOptionSet): Promise<void> {
    for (let i = 0; i < flags.length; i++) {
      const flag = flags[i];

      if (!this.optionFlagMapping.has(flag)) {
        this.throw(`Unknown option flag "${flag}"`);
      }

      const name = this.optionFlagMapping.get(flag)!;
      const definition = this.optionDefinitionMap.get(name)!;

      if (definition.required) {
        requiredOptionSet!.delete(name);
      }

      if (definition.toggle) {
        commandOptions![definition.key] = true;
      } else {
        if (i !== flags.length - 1) {
          this.throw("Only the last flag in a sequence can refer to an option instead of a toggle");
        }

        await this.consumeOption(definition, args, commandOptions, context);
      }
    }
  }

  private async consumeToggleOrOption(name: string, requiredOptionSet, commandOptions, args): Promise<void> {
    if (!this.optionDefinitionMap.has(name)) {
      this.throw(`Unknown option \`${name}\``);
    }

    const definition = this.optionDefinitionMap.get(name)!;

    if (definition.required) {
      requiredOptionSet!.delete(name);
    }

    if (definition.toggle) {
      commandOptions![definition.key] = true;
    } else {
      await this.consumeOption(definition, args, commandOptions, context);
    }
  }

  // TODO: remove args shifting and make this for only one arg
  // TODO: remove commandOptions mutation from here
  private async consumeOption(definition: OptionDefinition<any>, args, commandOptions, context): Promise<void> {
    const arg = args.shift();

    if (arg === undefined) {
      this.throw(`Expecting value for option \`${definition.name}\``);
    }

    if (arg[0] === "-" && isNaN(Number(arg))) {
      this.throw(`Expecting a value instead of an option or toggle "${arg}" for option \`${definition.name}\``);
    }

    commandOptions![definition.key] =
      await this.castArgument(arg, definition.name, definition.type, definition.validators, false, context);
  }

  // TODO: do this really belongs here ?
  private async castArgument(
    arg: string,
    name: string,
    type: CastableType<any>,
    validators: GeneralValidator<any>[],
    usingDefault: boolean,
    context: Context,
  ): Promise<any> {
    const castingContext = buildCastingContext(context, {
      default: usingDefault,
      name,
      validators,
    });

    return await cast(arg, type, castingContext);
  }

  // TODO: not sure if this doesn't remove readability
  private throw(error: string) {
    throw new UsageError(error, this.helpProvider);
  }
}
