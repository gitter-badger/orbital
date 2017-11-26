import { Command, Options } from '../../../../..';
export declare class SomeOptions extends Options {
    help: string;
}
export default class  extends Command {
    execute(options: SomeOptions): string;
}
