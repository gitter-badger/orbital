import {
  Command,
  Executable,
  Param
} from '../../../../..';

@Command({
  brief: 'Extra extra foo brief',
  description: 'Extra extra foo description',
})
export default class extends Executable {
  execute(
    @Param({
      description: 'Some name',
    })
    name: string,
  ) {
    return JSON.stringify({
      extraExtra: true,
      name,
    }, undefined, 2);
  }
}
