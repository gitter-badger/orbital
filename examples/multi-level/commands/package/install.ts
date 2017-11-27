import {
  Command,
  Executable,
  Param,
} from '../../../../packages/core';

@Command({
  description: 'Install a package',
})
export default class extends Executable {
  execute(
    @Param({
      required: true,
      description: 'Name of package to install',
    })
    name: string,
  ) {
    return `Guess what, try command \`npm install ${name}\`.`;
  }
}
