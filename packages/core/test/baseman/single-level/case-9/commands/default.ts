import {
  Command,
  Executable,
  Metadata,
  Option,
  Options
} from '../../../../..';

export class SomeOptions extends Options {
  @Option({
    required: true,
  })
  fooBar: number;
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
