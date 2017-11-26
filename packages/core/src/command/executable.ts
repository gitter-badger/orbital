import { HelpBuildingContext } from './help/help-building-context';
/**
 * The abstract `Executable` class to be extended.
 */
export abstract class Executable {
  /**
   * @returns A promise or normal value.
   */
  abstract execute(...args: any[]): Promise<any> | any;

  /** @internal */
  static decorated = false;
  /** @internal */
  static path: string;
  /** @internal */
  static helpBuildingContexts: HelpBuildingContext[];
  /** @internal */
  static sequence: string[];
  /** @internal */
  static brief: string | undefined;
  /** @internal */
  static description: string | undefined;

  /** @internal */
  static paramDefinitions: ParamDefinition<any>[];
  /** @internal */
  static paramsDefinition: ParamsDefinition<any>;
  /** @internal */
  static optionsConstructor: Orbital.Constructor<Map<string, any>>;
  /** @internal */
  static optionDefinitions: OptionDefinition<any>[];
  /** @internal */
  static contextConstructor: typeof Context;
  /** @internal */
  static requiredParamsNumber = 0;

  /**
   * Get the help object of current command.
   */
  static async getHelp(): Promise<HelpInfo> {
    return await HelpInfo.build(this);
  }
}
