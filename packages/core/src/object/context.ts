import { ContextOptions } from './context-options';
/**
 * Command context.
 */
export class Context {
  /** Current working directory. */
  cwd: string;
  /** Commands sequence including entry and subcommands. */
  commands: string[];

  constructor({ cwd, commands }: ContextOptions) {
    this.cwd = cwd;
    this.commands = commands;
  }
}
