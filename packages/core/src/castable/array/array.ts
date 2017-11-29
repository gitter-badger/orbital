import * as villa from 'villa';

import { CastableType, CastingContext, StringCastable, buildCastingContext, cast } from '../../object';

import { ArrayCastingOptions } from './array-casting-options';

export function array<T>(
  type: CastableType<any>,
  options: ArrayCastingOptions<T> = {},
): StringCastable<T[]> {
  return {
    async cast(str: string, context: CastingContext<T[]>): Promise<T[]> {
      if (!options.separator) {
        options.separator = ',';
      }

      str = str.replace(
        new RegExp('[' + options.separator + '[\s]*]', 'g'),
        options.separator as string);

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
