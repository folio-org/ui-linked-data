import { IResultFormatter, ResultFormatterOptions } from '../../types';
import { createCompositeKeyBuilder } from '../../utils';

/**
 * Formats Authority data for search/browse results
 * Output: Flat table rows with metadata
 */
export class AuthoritiesResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[], sourceData?: unknown, options?: ResultFormatterOptions): SearchResultsTableRow[] {
    const authoritiesList = data as (AuthorityAsSearchResultDTO | AuthorityAsBrowseResultDTO)[];
    const sources = (sourceData as SourceDataDTO) || [];

    return this.formatAuthorities(authoritiesList, sources, options?.notSpecifiedLabel);
  }

  private formatAuthorities(
    authoritiesList: AuthorityAsSearchResultDTO[] | AuthorityAsBrowseResultDTO[],
    sourceData?: SourceDataDTO,
    notSpecifiedLabel?: string,
  ): SearchResultsTableRow[] {
    const buildFallbackKey = createCompositeKeyBuilder();

    return authoritiesList?.map(authorityEntry => {
      const selectedEntry = (authorityEntry.authority ?? authorityEntry) as AuthorityAsSearchResultDTO;
      const { id = '', authRefType = '', headingRef = '', headingType = '', sourceFileId = '' } = selectedEntry;
      const sourceLabel = sourceData?.find(({ id: sourceId }) => sourceId === sourceFileId)?.name;
      const { isAnchor } = authorityEntry;

      return {
        __meta: {
          id,
          key: id || buildFallbackKey('authority', [headingRef, headingType, authRefType, sourceFileId, isAnchor]),
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
          label: sourceLabel ?? notSpecifiedLabel ?? sourceFileId,
          className: 'authority-source',
        },
      };
    });
  }
}
