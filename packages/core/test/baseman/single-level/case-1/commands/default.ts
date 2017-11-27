import {
  Command,
  Context,
  Executable,
  Param
} from '../../../../..';

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  execute(
    @Param({
      description: 'Some name',
      required: true,
    })
    name: string,

    @Param({
      default: 123,
    })
    value: number,

    context: Context,
  ) {
    return JSON.stringify({
      name,
      value,
      commands: context.commands,
    }, undefined, 2);
  }
}
