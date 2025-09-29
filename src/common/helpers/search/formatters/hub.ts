import { v4 as uuidv4 } from 'uuid';

const checkAuthNote = (notes: string[]): boolean => notes.some(note => note.includes('Created from auth.'));

const checkRDANote = (notes: string[]): boolean => {
  const rdaRegex = /040.*\$erda/;

  return notes.some(note => rdaRegex.test(note));
};

export const formatHubItem = (hubList: HubSearchResultDTO[]): SearchResultsTableRow[] =>
  hubList?.map(hubEntry => {
    const { aLabel = '', uri = '', token = '', more } = hubEntry;
    const { notes = [] } = more || {};

    return {
      __meta: {
        id: token,
        key: uuidv4(),
        isAnchor: false,
      },
      hub: {
        label: aLabel,
        uri: uri,
        className: 'hub-title',
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
