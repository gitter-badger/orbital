import {
  Command,
  Executable,
  Param,
} from '../../../../..';

@Command({
  brief: 'Foo brief',
  description: 'Foo description',
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
