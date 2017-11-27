import ExtendableError from 'extendable-error';
import { Printable } from './object/printable';
import chalk from 'chalk';

export class ExpectedError extends ExtendableError implements Printable {
  constructor(
    message: string,
    public code = 1,
  ) {
    super(message);
  }

  print(stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): void {
    let output = `${chalk.dim.red('ERR')} ${this.message}.\n`;
    stderr.write(output);
  }
}
