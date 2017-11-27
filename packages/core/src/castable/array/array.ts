import * as villa from 'villa';

import { ArrayCastingOptions } from './array-casting-options';
import { CastableType } from '../../object/castable-type';
import { CastingContext } from '../../object/casting-context';
import { StringCastable } from '../../object/string-castable';
import { buildCastingContext } from '../../object/util';
import { cast } from '../../object/cast';

export function array<T>(
  type: CastableType<any>,
  options: ArrayCastingOptions<T> = {},
): StringCastable<T[]> {
  return {
    async cast(str: string, context: CastingContext<T[]>): Promise<T[]> {
      let parts = str.split(options.separator as any);

      if (options.trim) {
        parts = parts.map(part => part.trim());
      }

      if (!options.empty) {
        parts = parts.filter(part => !!part);
      }

      if (!options.validators) {
        options.validators = options.validator ? [options.validator] : [];
      }

      const castingContext = buildCastingContext(context, {
        default: context.default,
        name: `element of ${context.name}`,
        validators: options.validators,
      });

      return await villa.map(parts, part => cast(part, type, castingContext));
    },
  };
}
