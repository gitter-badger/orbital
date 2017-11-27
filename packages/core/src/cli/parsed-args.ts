import { Context } from "../object";

export interface ParsedArgs {
  args: any[];
  extraArgs?: any[];
  options?: Orbital.Dictionary<any>;
  context?: Context;
}
