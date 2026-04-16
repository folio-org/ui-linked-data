import { IResultFormatter } from '../../types';
import { createCompositeKeyBuilder, getIsLocalFlag, getSourceLabel } from '../../utils';

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
    const buildFallbackKey = createCompositeKeyBuilder();

    return hubList?.map(hubEntry => {
      const { suggestLabel = '', uri = '', token = '', more, aLabel = '', vLabel = '', sLabel = '' } = hubEntry;
      const { notes = [] } = more || {};
      const isLocal = getIsLocalFlag(hubEntry);
      const localId = (hubEntry as HubSearchResultDTO & { localId?: string }).localId;
      const sourceLabel = getSourceLabel(isLocal);
      const stableId = isLocal && localId ? localId : token;

      return {
        __meta: {
          id: stableId,
          key: stableId || buildFallbackKey('hub-lookup', [suggestLabel, uri, aLabel, vLabel, sLabel, isLocal]),
          isAnchor: false,
          isLocal,
        },
        hub: {
          label: suggestLabel,
          uri,
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
