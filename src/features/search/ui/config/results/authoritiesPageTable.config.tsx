import {
  AuthorityActionFormatter,
  AuthorityLabelFormatter,
  AuthoritySourceFormatter,
} from '@/features/search/ui/formatters';

export const authoritiesPageTableConfig: SearchResultsTableConfig = {
  columns: {
    label: {
      label: 'ld.label',
      position: 0,
      className: 'cell-fixed',
      minWidth: 320,
      formatter: AuthorityLabelFormatter,
    },
    type: {
      label: 'ld.type',
      position: 1,
      className: 'cell-fixed',
      minWidth: 160,
    },
    identifiers: {
      label: 'ld.identifiers',
      position: 2,
      className: 'cell-fixed',
      minWidth: 120,
    },
    authorized: {
      label: 'ld.authorizedReference',
      position: 3,
      className: 'cell-fixed',
      minWidth: 150,
    },
    source: {
      label: 'ld.source',
      position: 4,
      className: 'cell-fixed',
      minWidth: 150,
      formatter: AuthoritySourceFormatter,
    },
    action: {
      label: 'ld.action',
      position: 5,
      className: 'cell-fixed',
      minWidth: 100,
      maxWidth: 'max-content',
      formatter: AuthorityActionFormatter,
    },
  },
};
