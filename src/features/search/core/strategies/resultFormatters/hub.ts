import { IResultFormatter } from '../../types';
import { createCompositeKeyBuilder, getIsLocalFlag, getSourceLabel } from '../../utils';

/**
 * Formats Hub data for Search page results
 */
export class HubsResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const hubList = data as HubSearchResultDTO[];
    return this.formatHubs(hubList);
  }

  private formatHubs(hubList: HubSearchResultDTO[]): SearchResultsTableRow[] {
    const buildFallbackKey = createCompositeKeyBuilder();

    return hubList?.map(hubEntry => {
      const { suggestLabel = '', uri = '', token = '' } = hubEntry;
      const isLocal = getIsLocalFlag(hubEntry);
      const localId = (hubEntry as HubSearchResultDTO & { localId?: string }).localId;
      const sourceLabel = getSourceLabel(isLocal);
      const stableId = isLocal && localId ? localId : token;

      return {
        __meta: {
          id: stableId,
          key: stableId || buildFallbackKey('hub', [suggestLabel, uri, isLocal]),
          isAnchor: false,
          isLocal,
        },
        hub: {
          label: suggestLabel,
          uri: uri,
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
