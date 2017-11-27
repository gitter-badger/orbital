import {
  Command,
  Context,
  Executable,
  Param,
  Params
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

    @Params({
      description: 'Some values',
      type: Number,
    })
    values: number,

    context: Context,
  ) {
    return JSON.stringify({
      name,
      values,
      commands: context.commands,
    }, undefined, 2);
  }
}
