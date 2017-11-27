import {
  Command,
  Executable,
  Param,
} from '../../../../packages/core';

@Command({
  description: 'View package information (extra)',
})
export default class extends Executable {
  execute(
    @Param({
      required: true,
      description: 'Name of package to view',
    })
    name: string,
  ) {
    return `Guess what (extra), try command \`npm view ${name}\`.`;
  }
}
