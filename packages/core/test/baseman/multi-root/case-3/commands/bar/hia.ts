import {
  Command,
  Executable,
  Metadata
} from '../../../../../..';

@Command({
  brief: 'Hia',
  description: 'Hia description',
})
export default class extends Executable {
  @Metadata
  execute() {
    return 'Guess what';
  }
}
