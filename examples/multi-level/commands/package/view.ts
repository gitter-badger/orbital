import {
  Command,
  Executable,
  Param,
} from '../../../../packages/core';

@Command({
  description: 'View package information',
})
export default class extends Executable {
  execute(
    @Param({
      required: true,
      description: 'Name of package to view',
    })
    name: string,
  ) {
    return `Guess what, try command \`npm view ${name}\`.`;
  }
}
