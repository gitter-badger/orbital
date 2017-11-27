import { CastingContext } from './casting-context';
import { GeneralValidator } from '../validation/general-validator';

export interface CastingContextExtension<T> {
  name: string;
  validators: GeneralValidator<T>[];
  default: boolean;
  upper?: CastingContext<any>;
}
