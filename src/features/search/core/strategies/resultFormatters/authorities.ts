import { v4 as uuidv4 } from 'uuid';
import { IResultFormatter } from '../../types';

/**
 * Formats Authority data for search/browse results
 * Output: Flat table rows with metadata
 */
export class AuthoritiesResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[], sourceData?: unknown): SearchResultsTableRow[] {
    const authoritiesList = data as (AuthorityAsSearchResultDTO | AuthorityAsBrowseResultDTO)[];
    const sources = (sourceData as SourceDataDTO) || [];

    return this.formatAuthorities(authoritiesList, sources);
  }

  private formatAuthorities(
    authoritiesList: AuthorityAsSearchResultDTO[] | AuthorityAsBrowseResultDTO[],
    sourceData?: SourceDataDTO,
  ): SearchResultsTableRow[] {
    return authoritiesList?.map(authorityEntry => {
      const selectedEntry = (authorityEntry.authority ?? authorityEntry) as AuthorityAsSearchResultDTO;
      const { id = '', authRefType = '', headingRef = '', headingType = '', sourceFileId = '' } = selectedEntry;
      const sourceLabel = sourceData?.find(({ id: sourceId }) => sourceId === sourceFileId)?.name ?? sourceFileId;
      const { isAnchor } = authorityEntry;

      return {
        __meta: {
          id,
          key: uuidv4(),
          isAnchor,
        },
        authorized: {
          label: authRefType,
        },
        title: {
          label: headingRef,
          className: 'title',
        },
        subclass: {
          label: headingType,
          className: 'heading-type',
        },
        authoritySource: {
          label: sourceLabel,
          className: 'authority-source',
        },
      };
    });
  }
}

// Export standalone function for backward compatibility
export const formatAuthorityItem = (
  authoritiesList: AuthorityAsSearchResultDTO[] | AuthorityAsBrowseResultDTO[],
  sourceData?: SourceDataDTO,
): SearchResultsTableRow[] => {
  const formatter = new AuthoritiesResultFormatter();
  return formatter.format(authoritiesList, sourceData);
};
