import { Executable } from '../command/executable';
import { HelpInfoBuildPathOptions } from './help-info-build-path-options';

export type HelpInfoBuildOptions = typeof Executable | HelpInfoBuildPathOptions;
