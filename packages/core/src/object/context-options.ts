/**
 * Options for context.
 */
export interface ContextOptions {
  /** Current working directory. */
  cwd: string;
  /** Commands sequence including entry and subcommands. */
  commands: string[];
}
