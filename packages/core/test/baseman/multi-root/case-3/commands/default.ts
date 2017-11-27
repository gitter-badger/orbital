import {
  Command,
  Executable,
  Param,
  SubcommandDefinition
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
    alias: 'f',
    brief: 'Overridden foo brief',
  },
  {
    name: 'bar',
    brief: 'Overridden bar brief',
  },
];
