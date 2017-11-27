import { SubcommandSearchInProgressContext } from './subcommand-search-in-progress-context';

export interface SubcommandSearchContext extends SubcommandSearchInProgressContext {
  searchBase: string;
}
