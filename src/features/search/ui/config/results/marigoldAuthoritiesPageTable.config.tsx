import {
  AuthorityActionFormatter,
  AuthorityLabelFormatter,
  AuthoritySourceFormatter,
} from '@/features/search/ui/formatters';

export const marigoldAuthoritiesPageTableConfig: SearchResultsTableConfig = {
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
    lccn: {
      label: 'ld.lccn',
      position: 2,
      className: 'cell-fixed',
      minWidth: 160,
    },
    otherIdentifier: {
      label: 'ld.otherIdentifier',
      position: 3,
      className: 'cell-fixed',
      minWidth: 160,
    },
    source: {
      label: 'ld.source',
      position: 4,
      className: 'cell-fixed',
      minWidth: 200,
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
