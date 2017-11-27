import {
  Command,
  Executable,
  Metadata
} from '../../../../../..';

@Command()
export default class extends Executable {
  @Metadata
  execute() {
    return 'Guess what';
  }
}
