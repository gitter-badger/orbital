import { OptionDefinition } from './option-definition';

/**
 * The abstract `Options` class to be extended.
 */
export abstract class Options {
  /**
   * A type mark for @Option() decorator.
   * @internal
   */
  // tslint:disable-next-line:variable-name
  _options_mark: void;

  /** @internal */
  static definitions: OptionDefinition<any>[];
}
