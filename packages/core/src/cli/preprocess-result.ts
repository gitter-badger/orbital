import { CommandModule } from '../command/command-module';
import { SubcommandSearchContext } from '../subcommand/subcommand-search-context';

export interface PreProcessResult {
  sequence: string[];
  args: string[];
  path: string | undefined;
  module: CommandModule | undefined;
  searchContexts: SubcommandSearchContext[];
  possibleUnknownCommandName: string | undefined;
}
