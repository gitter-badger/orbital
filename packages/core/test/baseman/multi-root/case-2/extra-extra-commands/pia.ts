import {
  Command,
  Executable,
  Param
} from '../../../../..';

@Command({
  brief: 'Extra extra pia brief',
  description: 'Extra extra pia description',
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
