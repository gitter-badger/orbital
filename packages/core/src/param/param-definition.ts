import { CastableType } from '../object/castable-type';
import { GeneralValidator } from '../validation/general-validator';

/** @internal */
export interface ParamDefinition<T> {
  name: string;
  index: number;
  type: CastableType<any>;
  description: string | undefined;
  required: boolean;
  validators: GeneralValidator<T>[];
  default: T | string | undefined;
}
