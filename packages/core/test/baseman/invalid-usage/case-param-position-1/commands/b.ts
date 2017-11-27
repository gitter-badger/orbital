import {
  Command,
  Executable,
  Param,
} from '../../../../..';

@Command()
export default class extends Executable {
  execute(
    @Param()
    foo: string,

    @Param({
      required: true,
    })
    bar: string,
  ) { }
}
