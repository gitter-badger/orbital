import { ValidatorFunction } from './validation-function';
import { Validator } from './validator';

export type GeneralValidator<T> = ValidatorFunction<T> | Validator<T> | RegExp;
