import { authoritiesTableConfig } from '../../../search/ui/config/results/authoritiesTable.config';
import { hubsTableConfig } from '../../../search/ui/config/results/hubsTable.config';

export const SEARCH_RESULTS_TABLE_CONFIG: Record<string, SearchResultsTableConfig> = {
  default: authoritiesTableConfig,
  authorities: authoritiesTableConfig,
  hub: hubsTableConfig,
};
