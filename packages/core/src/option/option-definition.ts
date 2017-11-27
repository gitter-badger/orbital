import { GeneralValidator } from '../validation';
import { CastableType } from '../object';

/** @internal */
export interface OptionDefinition<T> {
  name: string;
  key: string;
  flag: string | undefined;
  placeholder: string | undefined;
  toggle: boolean;
  type: CastableType<T>;
  required: boolean;
  validators: GeneralValidator<T>[];
  default: T | string | undefined;
  description: string | undefined;
}
