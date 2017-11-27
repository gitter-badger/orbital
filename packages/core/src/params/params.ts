import * as Reflection from '../util/reflection';
import * as assert from 'assert';

import { Executable } from '../command/executable';
import { ParamsOptions } from './params-options';
import hyphenate from 'hyphenate';

/**
 * The `@Params()` decorator that decorates one array parameter of method
 * `execute` of a concrete `Command` class.
 */
export function Params<T>({
  name: paramName,
  type,
  required,
  validator,
  validators,
  description,
}: ParamsOptions<T>) {
  return (target: Executable, name: 'execute', index: number) => {
    assert.equal(name, 'execute');

    const constructor = target.constructor as typeof Executable;

    if (constructor.paramsDefinition) {
      throw new Error('Can only define one `params` parameter');
    }

    paramName = paramName ||
      // tslint:disable-next-line:no-unbound-method
      hyphenate(Reflection.getFunctionParameterName(target.execute, index), { lowerCase: true });

    if (!validators) {
      validators = validator ? [validator] : [];
    }

    constructor.paramsDefinition = {
      description,
      index,
      name: paramName,
      required: !!required,
      type,
      validators,
    };
  };
}
