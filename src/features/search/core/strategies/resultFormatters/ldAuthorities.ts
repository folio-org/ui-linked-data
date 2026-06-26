import { IResultFormatter } from '../../types';
import { createCompositeKeyBuilder } from '../../utils';

const parseTypeLabel = (typeUri: string): string => {
  const lastSlash = typeUri.lastIndexOf('/');
  return lastSlash !== -1 ? typeUri.slice(lastSlash + 1) : typeUri;
};

const formatLccn = (identifiers?: LDAuthorityIdentifier[]): string =>
  identifiers
    ?.filter(i => i.type === 'LCCN')
    .map(i => i.value.trim())
    .join(', ') ?? '';

export class LDAuthoritiesResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const list = data as LDAuthorityAsSearchResultDTO[];
    const buildFallbackKey = createCompositeKeyBuilder();

    return list?.map(entry => {
      const { id = '', label = '', types, identifiers } = entry;

      const typeLabel = types?.map(parseTypeLabel).join(', ') ?? '';
      const lccnLabel = formatLccn(identifiers);

      return {
        __meta: {
          id,
          key: id || buildFallbackKey('authority', [label, typeLabel]),
          isAnchor: false,
          isLD: true,
        },
        label: { label, className: 'title' },
        type: { label: typeLabel },
        lccn: { label: lccnLabel },
        otherIdentifier: { label: '' },
        authorized: { label: '' },
        source: { label: '' },
      };
    });
  }
}
