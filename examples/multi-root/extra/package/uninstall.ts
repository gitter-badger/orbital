import {
  Command,
  Executable,
  Param,
} from '../../../../packages/core';

@Command({
  description: 'Uninstall a package',
})
export default class extends Executable {
  execute(
    @Param({
      required: true,
      description: 'Name of package to uninstall',
    })
    name: string,
  ) {
    return `Guess what, try command \`npm uninstall ${name}\`.`;
  }
}
