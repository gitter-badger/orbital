import {
  Castable,
  Command,
  Executable,
  Param
} from '../../../../..';

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
