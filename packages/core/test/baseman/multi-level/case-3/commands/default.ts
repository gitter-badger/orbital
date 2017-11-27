import {
  Command,
  Executable,
  Param,
  SubcommandDefinition,
} from '../../../../..';

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  execute(
    @Param({
      description: 'Some name',
    })
    name: string,
  ) {
    return JSON.stringify({
      name,
    }, undefined, 2);
  }
}

export const subcommands: SubcommandDefinition[] = [
  {
    name: 'foo',
    brief: 'Overridden foo brief',
  },
];
