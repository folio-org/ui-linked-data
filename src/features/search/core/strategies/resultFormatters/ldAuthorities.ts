import { IResultFormatter } from '../../types';
import { createCompositeKeyBuilder } from '../../utils';

export class LDAuthoritiesResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const list = data as LDAuthorityAsSearchResultDTO[];
    const buildFallbackKey = createCompositeKeyBuilder();

    return list?.map(entry => {
      const { id = '', label = '', type = '', lccn = '' } = entry as LDAuthorityAsSearchResultDTO;

      return {
        __meta: {
          id,
          key: id || buildFallbackKey('authority', [label, type]),
          isAnchor: false,
          isLD: true,
        },
        label: { label, className: 'title' },
        type: { label: type },
        identifier: { label: lccn },
        authorized: { label: '' },
        source: { label: 'ld.source.localLdAuthority' },
      };
    });
  }
}
