import { IResultFormatter, ResultFormatterOptions } from '../../types';
import { createCompositeKeyBuilder } from '../../utils';

export class MarcAuthoritiesPageResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[], sourceData?: unknown, options?: ResultFormatterOptions): SearchResultsTableRow[] {
    const list = data as AuthorityAsSearchResultDTO[];
    const sources = (sourceData as SourceDataDTO) || [];
    const buildFallbackKey = createCompositeKeyBuilder();

    return list?.map(entry => {
      const {
        id = '',
        authRefType = '',
        headingRef = '',
        headingType = '',
        sourceFileId = '',
      } = entry as AuthorityAsSearchResultDTO;

      const lccn = (entry as Record<string, string>).lccn ?? '';
      const naturalId = (entry as Record<string, string>).naturalId ?? '';
      const sourceLabel = sources.find(s => s.id === sourceFileId)?.name;

      return {
        __meta: {
          id,
          key: id || buildFallbackKey('authority', [headingRef, headingType]),
          isAnchor: false,
          isLD: false,
        },
        label: { label: headingRef, className: 'title' },
        type: { label: headingType },
        identifier: { label: lccn || naturalId },
        authorized: { label: authRefType },
        source: { label: sourceLabel ?? options?.notSpecifiedLabel ?? sourceFileId },
      };
    });
  }
}
