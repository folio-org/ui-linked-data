import { formatAuthorityItem } from './authorities';
import { formatHubItem } from './hub';

type SearchResultData = AuthorityAsSearchResultDTO[] | AuthorityAsBrowseResultDTO[] | HubSearchResultDTO[];

export const SEARCH_RESULTS_FORMATTER: Record<
  string,
  (data: SearchResultData, sourceData?: SourceDataDTO) => SearchResultsTableRow[]
> = {
  default: (data: SearchResultData, sourceData?: SourceDataDTO) =>
    formatAuthorityItem(data as AuthorityAsSearchResultDTO[] | AuthorityAsBrowseResultDTO[], sourceData),
  authorities: (data: SearchResultData, sourceData?: SourceDataDTO) =>
    formatAuthorityItem(data as AuthorityAsSearchResultDTO[] | AuthorityAsBrowseResultDTO[], sourceData),
  hub: (data: SearchResultData) => formatHubItem(data as HubSearchResultDTO[]),
};
