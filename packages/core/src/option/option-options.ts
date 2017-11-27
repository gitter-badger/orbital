import { GeneralValidator } from '../validation';
import { CastableType } from '../object';

/**
 * Options for command options.
 */
export interface OptionOptions<T> {
  /**
   * Option name shown on usage, defaults to hyphenated name of correspondent
   * property.
   */
  name?: string;
  /** A single character as the shorthand of the option. */
  flag?: string;
  /** The placeholder shown on usage as `--option <placeholder>`. */
  placeholder?: string;
  /** Parameter type, defaults to type of emitted "design:type" metadata. */
  type?: CastableType<T>;
  /** Indicates whether this option is required, defaults to `false`. */
  required?: boolean;
  /**
   * The option validator, could be either a regular expression or an object
   * that matches `Validator` interface.
   */
  validator?: GeneralValidator<T>;
  /** The option validators. */
  validators?: GeneralValidator<T>[];
  /** Indicates whether this is a switch. */
  toggle?: boolean;
  /** Default value for this option. */
  default?: T | string;
  /** Description shown on usage. */
  description?: string;
}
