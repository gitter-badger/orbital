import { SubcommandDefinition } from './subcommand-definition';
export interface CommandModule {
  default?: CommandClass;
  brief?: string;
  description?: string;
  subcommands?: SubcommandDefinition[];
}
