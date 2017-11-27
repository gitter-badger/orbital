import * as fs from 'fs';
import * as path from 'path';
import * as villa from 'villa';

import { buildTableOutput, indent } from '../util/string';
import { existsDir, safeStat } from '../util/fs';

import { CLI } from '../cli/cli';
import { CommandClass } from '../command/command-class';
import { CommandModule } from '../command/command-module';
import { Executable } from '../command/executable';
import { HelpBuildingContext } from '../help/help-building-context';
import { HelpInfoBuildOptions } from './help-info-build-options';
import { Printable } from '../object/printable';
import { SubcommandHelpItem } from './subcommand-help-item';
import chalk from 'chalk';

export class HelpInfo implements Printable {
  private texts: string[] = [];

  get text(): string {
    return this.texts.join('\n');
  }

  async buildTextForSubCommands(contexts: HelpBuildingContext[]): Promise<void> {
    const labels: string[] = [];
    const labelToHelpItemsMap = new Map<string, SubcommandHelpItem[]>();
    const helpItemMap = new Map<string, SubcommandHelpItem>();

    for (const [groupIndex, { label, dir }] of contexts.entries()) {
      let helpItems: SubcommandHelpItem[];

      if (labelToHelpItemsMap.has(label)) {
        helpItems = labelToHelpItemsMap.get(label)!;
      } else {
        helpItems = [];
        labelToHelpItemsMap.set(label, helpItems);
        labels.push(label);
      }

      const definitions = await CLI.getSubcommandDefinitions(dir);

      for (const definition of definitions) {
        const { name, brief } = definition;
        const aliases = definition.aliases || definition.alias && [definition.alias] || [];

        let item: SubcommandHelpItem;
        const existingItem = helpItemMap.get(name);

        if (existingItem) {
          existingItem.overridden = true;

          item = {
            aliases: existingItem.aliases.concat(aliases),
            brief: brief || existingItem.brief,
            group: groupIndex,
            name,
          };
        } else {
          item = {
            aliases,
            brief,
            group: groupIndex,
            name,
          };
        }

        helpItems.push(item);
        helpItemMap.set(name, item);
      }

      if (!await existsDir(dir)) {
        continue;
      }

      const names = await villa.call<string[]>(fs.readdir, dir);

      for (let name of names) {
        let pth = path.join(dir, name);
        let stats = await safeStat(pth);

        if (stats!.isFile()) {
          if (name === 'default.js' || path.extname(pth) !== '.js') {
            continue;
          }

          name = path.basename(name, '.js');
        } else {
          pth = path.join(pth, 'default.js');
          stats = await safeStat(pth);
        }

        const existingItem = helpItemMap.get(name);

        // `brief` already set in `subcommands` field
        if (existingItem && existingItem.group === groupIndex && existingItem.brief) {
          continue;
        }

        let commandConstructor: CommandClass | undefined;
        let brief: string | undefined;

        if (stats) {
          const module = require(pth) as CommandModule;
          commandConstructor = module.default;
          brief = commandConstructor && (commandConstructor.brief || commandConstructor.description);
        }

        if (existingItem && existingItem.group === groupIndex) {
          existingItem.brief = brief;
        } else {
          let aliases: string[];

          if (existingItem) {
            if (!commandConstructor) {
              // Directory without an entry should not override existing one.
              continue;
            }

            existingItem.overridden = true;

            if (!brief) {
              brief = existingItem.brief;
            }

            aliases = existingItem.aliases;
          } else {
            aliases = [];
          }

          const item = {
            aliases,
            brief,
            group: groupIndex,
            name,
          };

          helpItems.push(item);
          helpItemMap.set(name, item);
        }
      }
    }

    for (const label of labels) {
      let hasAliases = false;
      const rows = labelToHelpItemsMap
        .get(label)!
        .filter(item => {
          if (item.overridden) {
            return false;
          }

          if (!hasAliases && item.aliases.length) {
            hasAliases = true;
          }

          return true;
        })
        .map(({ name, aliases, brief }) => {
          if (hasAliases) {
            return [
              chalk.bold(name),
              aliases.length ? `[${chalk.dim(aliases.join(','))}]` : '',
              brief,
            ];
          } else {
            return [
              chalk.bold(name),
              brief,
            ];
          }
        });

      const separators = hasAliases ? [' ', ' - '] : ' - ';

      if (rows.length) {
        this.texts.push(`\
  ${chalk.green(label.toUpperCase())}\n
${buildTableOutput(rows, { indent: 4, separators })}`);
      }
    }
  }

  print(stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): void {
    stderr.write(`\n${this.text}\n`);
  }

  private buildDescription(description: string | undefined): void {
    if (description) {
      this.texts.push(`${indent(description, 2)}\n`);
    }
  }

  private buildSubcommandsUsage(sequence: string[]) {
    if (sequence && sequence.length) {
      this.texts.push(`\
  ${chalk.green('USAGE')}\n
    ${chalk.bold(sequence.join(' '))} <subcommand>\n`);
    }
  }

  private buildTextsForParamsAndOptions(TargetCommand: typeof Executable): void {
    const paramDefinitions = TargetCommand.paramDefinitions;
    const paramsDefinition = TargetCommand.paramsDefinition;

    const parameterDescriptionRows: string[][] = [];
    let parameterUsageTexts: string[] = [];

    if (paramDefinitions) {
      parameterUsageTexts = paramDefinitions.map(definition => {
        const {
          name,
          required,
          description,
          default: defaultValue,
        } = definition;

        if (description) {
          parameterDescriptionRows.push([
            chalk.bold(name),
            description,
          ]);
        }

        return required ?
          `<${name}>` :
          `[${name}${defaultValue !== undefined ? `=${defaultValue}` : ''}]`;
      });
    } else {
      parameterUsageTexts = [];
    }

    if (paramsDefinition) {
      const {
        name,
        required,
        description,
      } = paramsDefinition;

      if (description) {
        parameterDescriptionRows.push([
          chalk.bold(name),
          description,
        ]);
      }

      parameterUsageTexts.push(
        required ?
          `<...${name}>` :
          `[...${name}]`,
      );
    }

    const optionDefinitions = TargetCommand.optionDefinitions || [];
    const requiredOptionUsageItems = optionDefinitions
      .filter(definition => definition.required)
      .map(({ name, key, placeholder }) => `--${name} <${placeholder || key}>`);

    let usageLine = [
      chalk.bold(TargetCommand.sequence.join(' ').replace(/^\/ /, '/')),
      ...parameterUsageTexts,
      ...requiredOptionUsageItems,
    ].join(' ');

    if (optionDefinitions.length > requiredOptionUsageItems.length) {
      usageLine += ' [...options]';
    }

    this.texts.push(`\
  ${chalk.green('USAGE')}\n
    ${usageLine}\n`);

    if (parameterDescriptionRows.length) {
      this.texts.push(`\
  ${chalk.green('PARAMETERS')}\n
${buildTableOutput(parameterDescriptionRows, { indent: 4, separators: ' - ' })}`);
    }

    if (optionDefinitions.length) {
      const optionRows = optionDefinitions
        .map(definition => {
          const {
            name,
            key,
            flag,
            placeholder,
            toggle: isToggle,
            description,
          } = definition;

          let triggerStr = flag ? `-${flag}, ` : '';

          triggerStr += `--${name}`;

          if (!isToggle) {
            triggerStr += ` <${placeholder || key}>`;
          }

          return [
            chalk.bold(triggerStr),
            description,
          ];
        });

      this.texts.push(`\
  ${chalk.green('OPTIONS')}\n
${buildTableOutput(optionRows, { indent: 4, separators: ' - ' })}`);
    }
  }

  /** @internal */
  static async build(options: HelpInfoBuildOptions): Promise<HelpInfo> {
    const info = new HelpInfo();

    if (typeof options === 'object') {
      info.buildDescription(options.description);
      info.buildSubcommandsUsage(options.sequence);

      await info.buildTextForSubCommands(options.contexts);
    } else {
      info.buildDescription(options.description);
      info.buildTextsForParamsAndOptions(options);

      await info.buildTextForSubCommands(options.helpBuildingContexts);
    }

    return info;
  }
}
