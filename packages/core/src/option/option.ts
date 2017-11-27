import * as assert from 'assert';

import { OptionOptions } from './option-options';
import { Options } from './options';
import hyphenate from 'hyphenate';

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
    let constructor = target.constructor as typeof Options;
    let definitions = constructor.definitions;

    if (definitions) {
      definitions = constructor.definitions;
    } else {
      definitions = constructor.definitions = [];
    }

    type = type || Reflect.getMetadata('design:type', target, name) as Orbital.Constructor<T>;

    optionName = optionName || hyphenate(name, { lowerCase: true });

    if (!validators) {
      validators = validator ? [validator] : [];
    }

    definitions.push({
      name: optionName,
      key: name,
      flag,
      placeholder,
      toggle: !!toggle,
      type,
      required: !!required,
      validators,
      default: defaultValue,
      description,
    });
  };
}
