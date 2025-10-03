import { authoritiesTableConfig } from './Authorities';
import { hubTableConfig } from './Hub';

export const SEARCH_RESULTS_TABLE_CONFIG: Record<string, SearchResultsTableConfig> = {
  default: authoritiesTableConfig,
  authorities: authoritiesTableConfig,
  hub: hubTableConfig,
};
