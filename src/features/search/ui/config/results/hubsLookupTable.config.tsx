import {
  AuthNotesFormatter,
  HubAssignFormatter,
  HubLinkFormatter,
  HubSourceFormatter,
  RDANotesFormatter,
} from '@/features/search/ui/formatters';

export const hubsLookupTableConfig: SearchResultsTableConfig = {
  columns: {
    assign: {
      label: 'ld.action',
      position: 0,
      className: 'cell-fixed',
      minWidth: 100,
      maxWidth: 100,
      formatter: HubAssignFormatter,
    },
    hub: {
      label: 'ld.hub',
      position: 1,
      className: 'cell-fixed',
      minWidth: 430,
      formatter: HubLinkFormatter,
    },
    source: {
      label: 'ld.source',
      position: 1,
      className: 'cell-fixed',
      minWidth: 200,
      maxWidth: 250,
      formatter: HubSourceFormatter,
    },
    auth: {
      label: 'ld.auth',
      position: 2,
      className: 'cell-fixed',
      minWidth: 170,
      maxWidth: 200,
      formatter: AuthNotesFormatter,
    },
    rda: {
      label: 'ld.rda',
      position: 3,
      className: 'cell-fixed',
      minWidth: 170,
      maxWidth: 200,
      formatter: RDANotesFormatter,
    },
  },
};
