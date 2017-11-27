import {
  Command,
  Executable,
  ExpectedError,
  Option,
  Options,
  Param,
  Params,
  Validation
} from '../../../../..';

export class FooOptions extends Options {
  @Option({
    description: 'Foo description',
    validator: Validation.integer,
  })
  foo: number;

  @Option({
    description: 'Bar description',
    validators: [
      Validation.integer,
      Validation.range(10, 20),
    ],
  })
  bar: number;
}

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  execute(
    @Param({
      validator: /yoha/,
    })
    foo: string,

    @Param({
      validators: [
        (value: number, { name }) => {
          if (value !== 123) {
            throw new ExpectedError(`Value of ${name} is not valid`);
          }
        },
      ],
    })
    bar: number,

    @Params({
      type: Number,
      validator: Validation.integer,
    })
    args: number[],

    options: FooOptions,
  ) {
    let data = Object.assign({
      args: [foo, bar, ...args],
    }, options);

    return JSON.stringify(data, undefined, 2);
  }
}
