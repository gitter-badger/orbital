import * as Path from 'path';
import * as villa from 'villa';

import { existsDir, existsFile } from '../util/fs';

import { HelpInfo } from '../help';
import { Context } from '../object/context';
import { Executable } from '../command/executable';
import { CommandRoot } from '../command/command-root';
import { CommandEntry } from '../command/command-entry';
import { CommandModule } from '../command/command-module';
import { GeneralCommandRoot } from '../command/general-command-root';

import { PreProcessResult } from './preprocess-result';
import { SubcommandDefinition } from '../subcommand/subcommand-definition';
import { SubcommandSearchContext } from '../subcommand/subcommand-search-context';
import { SubcommandSearchBaseResult } from '../subcommand/subcommand-base-search-result';
import { SubcommandSearchInProgressContext } from '../subcommand/subcommand-search-in-progress-context';

import { ArgsParser } from './args-parser';
import { UsageError } from '../error';

/**
 * Clime command line interface.
 */
export class CLI {
  roots: CommandRoot[];

  constructor(
    /** Command entry name. */
    public name: string,
    /** Root directory of command modules. */
    roots: GeneralCommandRoot | GeneralCommandRoot[],
  ) {
    roots = Array.isArray(roots) ? roots : [roots];
    this.roots = roots.map((root) => {
      let label: string | undefined;
      let path: string;

      if (typeof root === 'string') {
        path = root;
      } else {
        label = root.label;
        path = root.path;
      }

      return {
        label: label || 'Subcommands',
        path: Path.resolve(path),
      };
    });
  }

  async execute(argv: string[], cwd?: string): Promise<any>;
  async execute(argv: string[], contextExtension: object, cwd?: string): Promise<any>;
  async execute(
    argv: string[],
    contextExtension: object | string | undefined,
    cwd?: string | undefined,
  ): Promise<any> {
    if (typeof contextExtension === 'string') {
      cwd = contextExtension;
      contextExtension = undefined;
    }

    if (!cwd) {
      cwd = process.cwd();
    }

    const {
      sequence,
      args,
      path,
      module,
      searchContexts,
      possibleUnknownCommandName,
    } = await this.preProcessArguments(argv);

    let description: string | undefined;

    if (module) {
      const targetCommand = module.default;

      if (targetCommand && targetCommand.prototype instanceof Executable) {
        // This is a command module with an actual command.

        if (!targetCommand.decorated) {
          throw new TypeError(`Command defined in module "${path}" does not seem to be initialized, \
make sure to decorate it with \`@command()\``);
        }

        targetCommand.path = path!;
        targetCommand.helpBuildingContexts = searchContexts.map((ctxt) => {
          return {
            dir: ctxt.searchBase,
            label: ctxt.label,
          };
        });
        targetCommand.sequence = sequence;

        const argsParser = new ArgsParser(targetCommand);
        const parsedArgs = await argsParser.parse(sequence, args, cwd, contextExtension as object);

        if (!parsedArgs) {
          return await HelpInfo.build(targetCommand);
        }

        const command = new targetCommand();

        const {
          args: commandArgs,
          extraArgs: commandExtraArgs,
          options: commandOptions,
          context,
        } = parsedArgs;

        return await this.executeCommand(
          command,
          commandArgs,
          commandExtraArgs,
          commandOptions,
          context,
        );
      } else {
        // This is a command module with only description and subcommand definitions.
        description = module.description;
      }
    }

    const helpInfo = await HelpInfo.build({
      contexts: searchContexts.map((ctxt) => {
        return {
          dir: ctxt.searchBase,
          label: ctxt.label,
        };
      }),
      description,
      sequence,
    });

    if (possibleUnknownCommandName) {
      throw new UsageError(`Unknown subcommand "${possibleUnknownCommandName}"`, {
        getHelp() {
          return helpInfo;
        },
      });
    }

    if (args.length && HELP_OPTION_REGEX.test(args[0])) {
      return helpInfo;
    } else {
      throw helpInfo;
    }
  }

  private async preProcessSearchBase(searchBase: string, possibleCommandName: string, aliasMap: Map<string, string>):
    Promise<SubcommandSearchBaseResult> {
    const definitions = await CLI.getSubcommandDefinitions(searchBase);
    const definitionMap = new Map<string, SubcommandDefinition>();

    for (const definition of definitions) {
      definitionMap.set(definition.name, definition);

      const aliases = definition.aliases || definition.alias && [definition.alias];

      if (!aliases) {
        continue;
      }

      for (const alias of aliases) {
        if (aliasMap.has(alias)) {
          const targetName = aliasMap.get(alias);

          if (targetName !== definition.name) {
            throw new Error(`Alias "${alias}" already exists and points to "${targetName}" \
instead of "${definition.name}"`);
          }

          continue;
        }

        aliasMap.set(alias, definition.name);
      }
    }

    possibleCommandName = definitionMap.has(possibleCommandName) ?
      possibleCommandName : aliasMap.get(possibleCommandName) || possibleCommandName;

    searchBase = Path.join(searchBase, possibleCommandName);

    const entry = await CLI.findEntryBySearchBase(searchBase);

    return {
      module: entry && entry.module,
      name: possibleCommandName,
      path: entry && entry.path,
      searchBase: existsDir(searchBase) ? searchBase : undefined,
    };
  }

  /**
   * Mapping the command line arguments to a specific command file.
   */
  private async preProcessArguments(argv: string[]): Promise<PreProcessResult> {
    const sequence = [this.name];

    let possibleUnknownCommandName: string | undefined;

    let argsIndex = 0;

    let targetPath: string | undefined;
    let targetModule: CommandModule | undefined;

    let contexts: SubcommandSearchContext[] = await villa.map(this.roots, async root => {
      let path: string | undefined = Path.join(root.path, 'default.js');
      path = await existsFile(path) ? path : undefined;

      let module: CommandModule | undefined;

      if (path) {
        module = require(path) as CommandModule;

        if (module.default || !targetPath) {
          targetPath = path;
          targetModule = module;
        }
      }

      return {
        label: root.label,
        module,
        name: this.name,
        path,
        searchBase: root.path,
      };
    });

    for (let i = argsIndex; i < argv.length && contexts.length; i++) {
      let possibleCommandName = argv[i];

      if (!COMMAND_NAME_REGEX.test(possibleCommandName)) {
        break;
      }

      const aliasMap = new Map<string, string>();

      const nextContexts: SubcommandSearchInProgressContext[] = await villa.map(contexts, async (context) => {
        const searchBaseContext = await this.preProcessSearchBase(context.searchBase, possibleCommandName, aliasMap);
        return {
          label: context.label,
          ...searchBaseContext,
        };
      });

      const targetContexts = nextContexts.filter((ctxt) => !!ctxt.path);

      if (!targetContexts.length) {
        possibleUnknownCommandName = possibleCommandName;
        break;
      }

      let targetContext = targetContexts[0];

      for (const context of targetContexts.slice(1)) {
        const module = context.module;
        if (module && module.default) {
          targetContext = context;
        }
      }

      targetPath = targetContext.path;
      targetModule = targetContext.module;

      possibleCommandName = targetContext.name;

      argsIndex = i + 1;
      sequence.push(possibleCommandName);

      contexts = nextContexts.filter((ctxt) => !!ctxt.searchBase) as SubcommandSearchContext[];
    }

    return {
      args: argv.slice(argsIndex),
      module: targetModule,
      path: targetPath,
      possibleUnknownCommandName,
      searchContexts: contexts,
      sequence,
    };
  }

  private executeCommand(
    command: Executable,
    commandArgs: string[],
    commandExtraArgs: string[] | undefined,
    commandOptions: Orbital.Dictionary<any> | undefined,
    context: Context | undefined,
  ): any {
    const executeMethodArgs: any[] = commandArgs.concat();

    if (commandExtraArgs) {
      executeMethodArgs.push(commandExtraArgs);
    }

    if (commandOptions) {
      executeMethodArgs.push(commandOptions);
    }

    if (context) {
      executeMethodArgs.push(context);
    }

    return command.execute(...executeMethodArgs);
  }

  /**
   * @internal
   * Get subcommands definition written as `export subcommands = [...]`.
   */
  static async getSubcommandDefinitions(searchBase: string): Promise<SubcommandDefinition[]> {
    const entry = await this.findEntryBySearchBase(searchBase);

    if (!entry || !entry.module) {
      return [];
    }

    return entry.module.subcommands || [];
  }

  private static async findEntryBySearchBase(searchBase: string): Promise<CommandEntry | undefined> {
    const possiblePaths = [
      `${searchBase}.js`,
      Path.join(searchBase, 'default.js'),
    ];

    for (const possiblePath of possiblePaths) {
      if (await existsFile(possiblePath)) {
        return {
          module: require(possiblePath) as CommandModule,
          path: possiblePath,
        };
      }
    }

    if (await existsDir(searchBase)) {
      return {
        module: undefined,
        path: searchBase,
      };
    }

    return undefined;
  }
}
