/**
 * Validation context.
 */
export interface ValidationContext {
  /** A descriptive name of the validation target. */
  name: string;
  /** The source string of the value before being casted. */
  source: string;
}
