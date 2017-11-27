import { GeneralValidator } from '../../validation';

export interface ArrayCastingOptions<T> {
  /** Separator to split the input string, defaults to ",". */
  separator?: string | RegExp;
  /** Whether to trim split strings before casting, defaults to `true`. */
  trim?: boolean;
  /** Whether to keep empty strings after split, defaults to `false`. */
  empty?: boolean;
  validator?: GeneralValidator<T>;
  validators?: GeneralValidator<T>[];
}
