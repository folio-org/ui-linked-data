import { authoritiesTableConfig } from './Authorities';

export const SEARCH_RESULTS_TABLE_CONFIG: Record<string, SearchResultsTableConfig> = {
  default: authoritiesTableConfig,
  authorities: authoritiesTableConfig,
  hub: authoritiesTableConfig,
};
