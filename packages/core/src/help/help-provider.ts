import { HelpInfo } from "./help-info";


export interface HelpProvider {
  getHelp(): Promise<HelpInfo> | HelpInfo;
}
