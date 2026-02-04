import { v4 as uuidv4 } from 'uuid';

import { IResultFormatter } from '../../types';

const checkAuthNote = (notes: string[]) => notes.some(note => note.includes('Created from auth.'));

const checkRDANote = (notes: string[]) => {
  const rdaRegex = /040.*\$erda/;

  return notes.some(note => rdaRegex.test(note));
};

/**
 * Formats Hub data for Complex Lookup modal
 */
export class HubsLookupResultFormatter implements IResultFormatter<SearchResultsTableRow> {
  format(data: unknown[]): SearchResultsTableRow[] {
    const hubList = data as HubSearchResultDTO[];
    return this.formatHubs(hubList);
  }

  private formatHubs(hubList: HubSearchResultDTO[]): SearchResultsTableRow[] {
    return hubList?.map(hubEntry => {
      const { suggestLabel = '', uri = '', token = '', more } = hubEntry;
      const { notes = [] } = more || {};
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
        auth: {
          label: checkAuthNote(notes) ? 'ld.yes' : undefined,
          className: 'auth-note',
        },
        rda: {
          label: checkRDANote(notes) ? 'ld.yes' : undefined,
          className: 'rda-note',
        },
      };
    });
  }
}
