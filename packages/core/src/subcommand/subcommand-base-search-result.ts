import { CommandModule } from '../command';

export interface SubcommandSearchBaseResult {
  name: string;
  path?: string | undefined;
  module: CommandModule | undefined;
  searchBase: string | undefined;
}
