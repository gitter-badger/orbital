import {
  Command,
  Executable,
  Params,
  Validation,
} from '../../../../..';

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  execute(
    @Params({
      type: Number,
      validators: [
        Validation.integer,
        Validation.range(10, 20),
      ],
    })
    args: number[],
  ) {
    return JSON.stringify(args, undefined, 2);
  }
}
