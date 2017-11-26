import { Castable, Command } from '../../../../..';
export default class  extends Command {
    execute(names: Castable.CommaSeparatedStrings): string;
}
