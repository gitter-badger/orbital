import { Command, Options } from '../../../../..';
export declare class SomeOptions extends Options {
    foo: string;
    bar: number;
}
export default class  extends Command {
    execute(options: SomeOptions): string;
}
