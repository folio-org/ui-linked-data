import { v4 as uuidv4 } from 'uuid';

import { IResultFormatter } from '../../types';

/**
 * Formats Hub data for Search page results
 */
export class HubsResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const hubList = data as HubSearchResultDTO[];
    return this.formatHubs(hubList);
  }

  private formatHubs(hubList: HubSearchResultDTO[]): SearchResultsTableRow[] {
    return hubList?.map(hubEntry => {
      const { suggestLabel = '', uri = '', token = '' } = hubEntry;
      const isLocal = 'isLocal' in hubEntry ? (hubEntry as HubSearchResultDTO & { isLocal: boolean }).isLocal : false;

      // Determine source based on isLocal flag (set by enricher if configured)
      const sourceLabel = isLocal ? 'ld.source.libraryOfCongress.local' : 'ld.source.libraryOfCongress';

      return {
        __meta: {
          id: token,
          key: uuidv4(),
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
