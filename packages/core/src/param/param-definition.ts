import { CastableType } from '../object';
import { GeneralValidator } from '../validation';

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
