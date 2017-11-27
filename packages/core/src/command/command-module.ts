import { SubcommandDefinition } from '../subcommand';
import { CommandClass } from './command-class';

export interface CommandModule {
  default?: CommandClass;
  brief?: string;
  description?: string;
  subcommands?: SubcommandDefinition[];
}
