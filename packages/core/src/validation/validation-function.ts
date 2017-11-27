import { ValidationContext } from './validation-context';
/**
 * A function that validates a value.
 * It should throw an error (usually an instance of `ExpectedError`) if the
 * validation fails.
 * @param value - Value to be validated.
 * @param name - Name of the parameter or option, used for generating error
 * message.
 */
export type ValidatorFunction<T> = (value: T, context: ValidationContext) => void;
