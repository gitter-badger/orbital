import { ExpectedError } from './expected-error';
import { HelpProvider } from '../help';
import { Printable } from '../object';

export class UsageError extends ExpectedError implements Printable {
  constructor(
    message: string,
    public helpProvider: HelpProvider,
  ) {
    super(message);
  }

  async print(stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): Promise<void> {
    super.print(stdout, stderr);

    const help = await this.helpProvider.getHelp();
    help.print(stdout, stderr);
  }
}
