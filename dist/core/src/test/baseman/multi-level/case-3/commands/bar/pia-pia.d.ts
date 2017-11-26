import { Command, Options } from '../../../../../..';
export declare class PiaPiaOptions extends Options {
    name: string;
    switch: boolean;
}
export default class  extends Command {
    execute(options: PiaPiaOptions): string;
}
