import {
  Command,
  Executable,
  Metadata
} from '../../../../../..';

@Command({
  brief: 'Extra biu',
  description: 'Extra biu description',
})
export default class extends Executable {
  @Metadata
  execute() {
    return 'Extra guess what';
  }
}
