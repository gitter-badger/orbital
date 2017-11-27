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

    oops: number,

    @Params({
      type: String,
    })
    bar: string[],
  ) { }
}
