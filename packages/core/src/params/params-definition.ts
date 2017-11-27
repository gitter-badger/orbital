import { CastableType } from '../object/castable-type';
import { GeneralValidator } from '../validation/general-validator';

/** @internal */
export interface ParamsDefinition<T> {
  name: string;
  index: number;
  type: CastableType<any>;
  required: boolean;
  validators: GeneralValidator<T>[];
  description: string | undefined;
}
