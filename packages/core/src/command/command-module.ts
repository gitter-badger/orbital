import { CommandClass } from '../command/command-class';
import { SubcommandDefinition } from '../subcommand/subcommand-definition';
export interface CommandModule {
  default?: CommandClass;
  brief?: string;
  description?: string;
  subcommands?: SubcommandDefinition[];
}
