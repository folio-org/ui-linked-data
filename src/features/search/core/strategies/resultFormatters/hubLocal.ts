import { v4 as uuidv4 } from 'uuid';
import { IResultFormatter, LocalHubSearchResultDTO } from '../../types';

/**
 * Formats local Hub data for Search page results
 */
export class HubsLocalResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const hubList = data as LocalHubSearchResultDTO[];

    return this.formatHubs(hubList);
  }

  private formatHubs(hubList: LocalHubSearchResultDTO[]): SearchResultsTableRow[] {
    return hubList?.map(hubEntry => {
      const { label = '', id = '', originalId } = hubEntry;

      // Determine source based on originalId field
      const sourceLabel = originalId ? 'ld.source.libraryOfCongress.local' : 'ld.source.local';

      return {
        __meta: {
          id,
          key: uuidv4(),
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
