import { authoritiesTableConfig } from '../../../search/ui/config/results/authoritiesTable.config';
import { hubsLookupTableConfig } from '../../../search/ui/config/results/hubsLookupTable.config';

export const SEARCH_RESULTS_TABLE_CONFIG: Record<string, SearchResultsTableConfig> = {
  default: authoritiesTableConfig,
  authorities: authoritiesTableConfig,
  hub: hubsLookupTableConfig,
};
