import {
  Command,
  Executable,
  Metadata,
  Option,
  Options,
} from '../../../../../..';

export class PiaPiaOptions extends Options {
  @Option({
    description: 'Useless name',
    flag: 'n',
  })
  name: string;

  @Option({
    description: 'Useless switch',
    flag: 's',
    toggle: true,
  })
  switch: boolean;
}

@Command({
  brief: 'Pia',
  description: 'Pia pia description',
})
export default class extends Executable {
  @Metadata
  execute(options: PiaPiaOptions) {
    return JSON.stringify(options, undefined, 2);
  }
}
