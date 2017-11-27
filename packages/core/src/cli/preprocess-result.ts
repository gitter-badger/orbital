import { SubcommandSearchContext } from '../subcommand';
import { CommandModule } from '../command';

export interface PreProcessResult {
  sequence: string[];
  args: string[];
  path: string | undefined;
  module: CommandModule | undefined;
  searchContexts: SubcommandSearchContext[];
  possibleUnknownCommandName: string | undefined;
}
