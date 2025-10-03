import { HubAssignFormatter, AuthNotesFormatter, HubLinkFormatter, RDANotesFormatter } from '../formatters';

export const hubTableConfig: SearchResultsTableConfig = {
  columns: {
    assign: {
      label: '',
      position: 0,
      className: 'cell-fixed cell-fixed-100',
      formatter: HubAssignFormatter,
    },
    hub: {
      label: 'ld.hub',
      position: 1,
      className: 'cell-fixed cell-fixed-430',
      formatter: HubLinkFormatter,
    },
    auth: {
      label: 'ld.auth',
      position: 2,
      className: 'cell-fixed cell-fixed-170',
      formatter: AuthNotesFormatter,
    },
    rda: {
      label: 'ld.rda',
      position: 3,
      className: 'cell-fixed cell-fixed-170',
      formatter: RDANotesFormatter,
    },
  },
};
