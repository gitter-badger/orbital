import hyphenate from 'hyphenate';
import * as assert from 'assert';

import { OptionOptions } from './option-options';
import { Options } from './options';

/**
 * The `Option()` decorator that decorates concrete class of `Options`.
 */
export function Option<T>({
  name: optionName,
  flag,
  placeholder,
  toggle,
  type,
  required,
  validator,
  validators,
  default: defaultValue,
  description,
}: OptionOptions<T> = {}) {
  assert(!flag || /^[a-z]$/i.test(flag), 'The option flag is expected to be a letter');

  return (target: Options, name: string) => {
    const constructor = target.constructor as typeof Options;
    const definitions = constructor.definitions || [];
    constructor.definitions = definitions;

    type = type || Reflect.getMetadata('design:type', target, name) as Orbital.Constructor<T>;

    optionName = optionName || hyphenate(name, { lowerCase: true });

    if (!validators) {
      validators = validator ? [validator] : [];
    }

    definitions.push({
      default: defaultValue,
      description,
      flag,
      key: name,
      name: optionName,
      placeholder,
      required: !!required,
      toggle: !!toggle,
      type,
      validators,
    });
  };
}
