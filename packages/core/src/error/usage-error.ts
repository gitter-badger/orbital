import { HelpProvider } from '../help/help-provider';
import { ExpectedError } from './expected-error';
import { Printable } from '../object/printable';

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
