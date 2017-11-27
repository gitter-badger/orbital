import {
  Command,
  Executable,
  Metadata,
} from '../../../packages/core';

@Command({
  brief: 'Print version',
  description: 'Print version of this tool',
})
export default class extends Executable {
  @Metadata
  execute() {
    return '0.0.0';
  }
}
