import { CommandModule } from './command-module';
export interface CommandEntry {
  path: string;
  module: CommandModule | undefined;
}
