import {
  Command,
  Executable,
  Param,
  Params,
} from '../../../../..';

@Command()
export default class extends Executable {
  execute(
    @Param()
    foo: string,

    @Params({
      type: String,
      required: true,
    })
    bar: string[],
  ) { }
}
