import {
  Command,
  Executable,
  Param,
} from '../../../../..';

@Command()
export default class extends Executable {
  execute(
    foo: string,

    @Param()
    bar: string,
  ) { }
}
