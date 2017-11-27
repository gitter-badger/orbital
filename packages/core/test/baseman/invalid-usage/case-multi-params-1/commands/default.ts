import {
  Executable,
  Param,
  Params
} from '../../../../..';

export default class extends Executable {
  execute(
    @Param({
      description: 'Some name',
      required: true,
    })
    name: string,

    @Params({
      type: String,
    })
    texts: string[],

    @Params({
      type: String,
    })
    extraTexts: string[],
  ) { }
}
