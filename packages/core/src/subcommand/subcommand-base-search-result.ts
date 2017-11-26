import { CommandModule } from './command-module';

export interface SubcommandSearchBaseResult {
  name: string;
  path?: string | undefined;
  module: CommandModule | undefined;
  searchBase: string | undefined;
}
