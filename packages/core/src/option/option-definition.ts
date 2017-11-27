import { CastableType } from '../object/castable-type';
import { GeneralValidator } from '../validation/general-validator';

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
