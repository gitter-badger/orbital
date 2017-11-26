import { Validator } from './validator';
import { ValidatorFunction } from './validation-function';

export type GeneralValidator<T> = ValidatorFunction<T> | Validator<T> | RegExp;
