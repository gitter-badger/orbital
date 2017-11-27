import { CastableType } from '../object';
import { GeneralValidator } from '../validation';

/** @internal */
export interface ParamsDefinition<T> {
  name: string;
  index: number;
  type: CastableType<any>;
  required: boolean;
  validators: GeneralValidator<T>[];
  description: string | undefined;
}
