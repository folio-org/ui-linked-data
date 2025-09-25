import { formatAuthorityItem } from './authorities';

export const SEARCH_RESULTS_FORMATTER: Record<
  string,
  (data: any, sourceData?: SourceDataDTO) => SearchResultsTableRow[]
> = {
  default: formatAuthorityItem,
  authorities: formatAuthorityItem,
  hub: formatAuthorityItem,
};
