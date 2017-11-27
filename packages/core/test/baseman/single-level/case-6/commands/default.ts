import {
  Command,
  Executable,
  Metadata,
  Option,
  Options
} from '../../../../..';

export class SomeOptions extends Options {
  @Option({
    description: 'guess what',
    placeholder: 'yo',
    flag: 'h',
    required: true,
  })
  foo: string;

  @Option({
    default: '456',
  })
  bar: number;
}

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  @Metadata
  execute(options: SomeOptions) {
    return JSON.stringify(options, undefined, 2);
  }
}
