import {
  Executable,
  Param,
} from '../../../../..';

export default class extends Executable {
  execute(
    @Param({
      description: 'Some name',
      required: true,
    })
    name: string,
  ) { }
}
