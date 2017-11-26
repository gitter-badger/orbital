import { Command, Options } from '../../../../..';
export declare class SomeOptions extends Options {
    fooBar: number;
}
export default class  extends Command {
    execute(options: SomeOptions): string;
}
