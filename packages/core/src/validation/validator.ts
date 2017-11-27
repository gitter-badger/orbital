import { ValidationContext } from './validation-context';

/**
 * Validator interface for parameters or options.
 */
export interface Validator<T> {
  /**
   * A method that validates a value.
   * It should throw an error (usually an instance of `ExpectedError`) if the
   * validation fails.
   * @param value - Value to be validated.
   * @param name - Name of the parameter or option, used for generating error
   * message.
   */
  validate(value: T, context: ValidationContext): void;
}
