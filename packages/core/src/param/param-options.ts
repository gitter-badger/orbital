import { CastableType } from '../object/castable-type';
import { GeneralValidator } from '../validation/general-validator';
/**
 * Options for command parameter.
 */
export interface ParamOptions<T> {
  /**
   * Parameter name shown on usage, defaults to the name of correspondent
   * function parameter.
   */
  name?: string;
  /** Parameter type, defaults to type of emitted "design:type" metadata. */
  type?: CastableType<any>;
  /** Indicates whether this parameter is required, defaults to `false`. */
  required?: boolean;
  /**
   * The parameter validator, could be either a regular expression or an
   * object that matches `Validator` interface.
   */
  validator?: GeneralValidator<T>;
  /** The parameter validators. */
  validators?: GeneralValidator<T>[];
  /** Default value for this parameter. */
  default?: T | string;
  /** Description shown on usage. */
  description?: string;
}
