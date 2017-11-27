import { GeneralValidator } from '../validation';
import { CastableType } from '../object';

/**
 * Options for variadic command parameters.
 */
export interface ParamsOptions<T> {
  /**
   * Variadic parameters name shown on usage, defaults to the name of
   * correspondent function parameter.
   */
  name?: string;
  /** Type of every element in variadic parameters. */
  type: CastableType<any>;
  /**
   * Indicates whether at least one element is required, defaults to `false`.
   */
  required?: boolean;
  /**
   * The variadic parameters validator, could be either a regular expression
   * or an object that matches `Validator` interface.
   */
  validator?: GeneralValidator<T>;
  /** The variadic parameters validators. */
  validators?: GeneralValidator<T>[];
  /** Description shown on usage. */
  description?: string;
}
