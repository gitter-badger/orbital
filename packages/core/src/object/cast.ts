import { buildCastingContext, isStringCastable } from './util';

import { CastableType } from './castable-type';
import { CastingContext } from './casting-context';
import { ExpectedError } from '../error';

export async function cast<T>(
  source: string,
  type: CastableType<T>,
  context: CastingContext<T>,
): Promise<T> {
  let value: any;

  const {
    name,
    validators,
    default: usingDefault,
  } = context;

  switch (type as CastableType<any>) {
    case String:
      value = source;
      break;
    case Number:
      value = Number(source);

      if (isNaN(value)) {
        throw new ExpectedError(`Value "${source}" cannot be casted to number`);
      }

      break;
    case Boolean:
      if (/^(?:f|false)$/i.test(source)) {
        value = false;
      } else {
        let n = Number(source);
        value = isNaN(n) ? true : Boolean(n);
      }

      break;
    default:
      if (!isStringCastable(type)) {
        throw new Error(`Type \`${type.name || type}\` cannot be casted from a string, \
see \`StringCastable\` interface for more information`);
      }

      const castingContext = buildCastingContext(context, {
        default: usingDefault,
        name,
        upper: context,
        validators,
      });

      value = await type.cast(source, castingContext);

      break;
  }

  for (const validator of validators) {
    if (validator instanceof RegExp) {
      if (!validator.test(source)) {
        throw new ExpectedError(`Invalid value for "${name}"`);
      }
    } else if (typeof validator === 'function') {
      validator(value, { name, source });
    } else {
      validator.validate(value, { name, source });
    }
  }

  return value;

}
