import { IResultFormatter } from '../../types';
import { createCompositeKeyBuilder } from '../../utils';

const parseTypeLabel = (typeUri: string): string => {
  const lastSlash = typeUri.lastIndexOf('/');

  return lastSlash !== -1 ? typeUri.slice(lastSlash + 1) : typeUri;
};

const formatIdentifiers = (identifiers?: LDAuthorityIdentifier[]): string =>
  identifiers?.map(i => i.value.trim()).join(', ') ?? '';

export class LDAuthoritiesResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const list = data as LDAuthorityAsSearchResultDTO[];
    const buildFallbackKey = createCompositeKeyBuilder();

    return list?.map(entry => {
      const { id = '', label = '', types, identifiers } = entry;

      const typeLabel = types?.map(parseTypeLabel).join(', ') ?? '';
      const identifiersLabel = formatIdentifiers(identifiers);

      return {
        __meta: {
          id,
          key: id || buildFallbackKey('authority', [label, typeLabel]),
          isAnchor: false,
          isLD: true,
        },
        label: { label, className: 'title' },
        type: { label: typeLabel },
        identifiers: { label: identifiersLabel },
        authorized: { label: '' },
        source: { label: '' },
      };
    });
  }
}
