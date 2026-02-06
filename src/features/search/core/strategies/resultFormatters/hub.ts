import { v4 as uuidv4 } from 'uuid';

import { IResultFormatter } from '../../types';
import { getIsLocalFlag, getSourceLabel } from '../../utils';

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
      const isLocal = getIsLocalFlag(hubEntry);
      const sourceLabel = getSourceLabel(isLocal);

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
