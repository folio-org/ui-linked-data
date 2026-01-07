import { v4 as uuidv4 } from 'uuid';
import { IResultFormatter } from '../../types';

/**
 * Formats Hub data for Search page results
 *
 * Note: Source enrichment (Library of Congress vs Library of Congress, Local)
 * happens later via useEnrichHubsWithLocalCheck hook
 */
export class HubsResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const hubList = data as HubSearchResultDTO[];
    return this.formatHubs(hubList);
  }

  private formatHubs(hubList: HubSearchResultDTO[]): SearchResultsTableRow[] {
    return hubList?.map(hubEntry => {
      const { suggestLabel = '', uri = '', token = '' } = hubEntry;

      return {
        __meta: {
          id: token,
          key: uuidv4(),
          isAnchor: false,
        },
        hub: {
          label: suggestLabel,
          uri: uri,
          className: 'hub-title',
        },
        source: {
          label: 'ld.source.libraryOfCongress', // Base source, enriched later with local info
          className: 'hub-source',
        },
      };
    });
  }
}
