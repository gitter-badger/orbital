import {
  Command,
  command,
  param,
} from '../../../../..';

@command()
export default class extends Command {
  execute(
    foo: string,

    @param()
    bar: string,
  ) { }
}
