import * as Reflection from '../util/reflection';
import * as assert from 'assert';

import { CastableType } from '../object/castable-type';
import { Executable } from '../command/executable';
import { ParamOptions } from './param-options';
import hyphenate from 'hyphenate';

/**
 * The `@Param()` decorator that decorates parameters of method `execute` on a
 * concrete `Command` class.
 * This decorator could only be applied to continuous parameters of which the
 * index starts from 0.
 */
export function Param<T>({
  name: paramName,
  type,
  required,
  validator,
  validators,
  default: defaultValue,
  description,
}: ParamOptions<T> = {}) {
  return (target: Executable, name: 'execute', index: number) => {
    assert.equal(name, 'execute');

    const constructor = target.constructor as typeof Executable;
    const definitions = constructor.paramDefinitions || [];
    constructor.paramDefinitions = definitions;

    type = type ||
      Reflect.getMetadata('design:paramtypes', target, 'execute')[index] as CastableType<T>;

    paramName = paramName ||
      hyphenate(Reflection.getFunctionParameterName(target.execute, index), { lowerCase: true });

    if (!validators) {
      validators = validator ? [validator] : [];
    }

    definitions[index] = {
      default: defaultValue,
      description,
      index,
      name: paramName,
      required: !!required,
      type,
      validators,
    };
  };
}
