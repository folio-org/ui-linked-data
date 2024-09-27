import { formatAuthorityItem } from './authorities';

export const SEARCH_RESULTS_FORMATTER: Record<string, (data: any) => SearchResultsTableRow[]> = {
  authorities: formatAuthorityItem,
};
