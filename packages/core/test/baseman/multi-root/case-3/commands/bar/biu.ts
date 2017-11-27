import {
  Command,
  Executable,
  Metadata
} from '../../../../../..';

@Command({
  brief: 'Biu',
  description: 'Biu description',
})
export default class extends Executable {
  @Metadata
  execute() {
    return 'Guess what';
  }
}
