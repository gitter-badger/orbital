import { Command, Options } from '../../../../..';
export declare class FooOptions extends Options {
    foo: number;
    bar: number;
}
export default class  extends Command {
    execute(foo: string, bar: number, args: number[], options: FooOptions): string;
}
