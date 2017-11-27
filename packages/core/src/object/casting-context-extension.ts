import { CastingContext } from './casting-context';
import { GeneralValidator } from '../validation';

export interface CastingContextExtension<T> {
  name: string;
  validators: GeneralValidator<T>[];
  default: boolean;
  upper?: CastingContext<any>;
}
