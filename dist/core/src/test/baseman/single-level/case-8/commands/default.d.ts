import { Castable, Command, SubcommandDefinition } from '../../../../..';
export declare const subcommands: SubcommandDefinition[];
export default class  extends Command {
    execute(names: Castable.CommaSeparatedStrings): string;
}
