import {
  Command,
  Executable,
  Metadata,
  Option,
  Options
} from '../../../../..';

export class FooOptions extends Options {
  @Option({
    description: 'guess what foo',
    placeholder: 'yo',
    flag: 'h',
    required: true,
  })
  foo: string;
}

export class FooBarOptions extends FooOptions {
  @Option({
    description: 'guess what bar',
  })
  bar: number;
}

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  @Metadata
  execute(options: FooBarOptions) {
    return JSON.stringify(options, undefined, 2);
  }
}
