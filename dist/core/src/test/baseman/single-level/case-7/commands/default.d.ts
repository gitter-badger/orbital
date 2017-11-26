import { Command, Options } from '../../../../..';
export declare class FooOptions extends Options {
    foo: string;
}
export declare class FooBarOptions extends FooOptions {
    bar: number;
}
export default class  extends Command {
    execute(options: FooBarOptions): string;
}
