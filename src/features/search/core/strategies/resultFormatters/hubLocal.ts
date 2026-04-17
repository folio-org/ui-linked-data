import { IResultFormatter, LocalHubSearchResultDTO } from '../../types';
import { createCompositeKeyBuilder } from '../../utils';

/**
 * Formats local Hub data for Search page results
 */
export class HubsLocalResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const hubList = data as LocalHubSearchResultDTO[];

    return this.formatHubs(hubList);
  }

  private formatHubs(hubList: LocalHubSearchResultDTO[]): SearchResultsTableRow[] {
    const buildFallbackKey = createCompositeKeyBuilder();

    return hubList?.map(hubEntry => {
      const { label = '', id = '', originalId } = hubEntry;

      // Determine source based on originalId field
      const sourceLabel = originalId ? 'ld.source.libraryOfCongress.local' : 'ld.source.local';

      return {
        __meta: {
          id,
          key: id || buildFallbackKey('hub-local', [label, originalId]),
          isAnchor: false,
          isLocal: true,
          originalId,
        },
        hub: {
          label,
          uri: '',
          className: 'hub-title',
        },
        source: {
          label: sourceLabel,
          className: 'hub-source',
        },
      };
    });
  }
}
