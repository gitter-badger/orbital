import {
  Command,
  Executable,
  Param,
} from '../../../../packages/core';

@Command({
  description: 'Find package information',
})
export default class extends Executable {
  execute(
    @Param({
      required: true,
      description: 'Pattern of package to find',
    })
    pattern: string,
  ) { }
}
