import {
  Castable,
  Command,
  Executable,
  Param,
  SubcommandDefinition
} from '../../../../..';

export const subcommands: SubcommandDefinition[] = [
  {
    name: 'bar',
    brief: 'Bababa, ba-banana',
  },
];

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  execute(
    @Param({
      description: 'Some names',
      default: 'yo,ha',
    })
    names: Castable.CommaSeparatedStrings,
  ) {
    return JSON.stringify(names, undefined, 2);
  }
}
