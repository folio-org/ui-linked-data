import { HubLinkFormatter, HubSourceFormatter, HubActionFormatter } from '@/features/search/ui/formatters';

export const hubsTableConfig: SearchResultsTableConfig = {
  columns: {
    hub: {
      label: 'ld.hub',
      position: 0,
      className: 'cell-fixed',
      minWidth: 500,
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
    action: {
      label: 'ld.action',
      position: 2,
      className: 'cell-fixed',
      minWidth: 100,
      maxWidth: 'max-content',
      formatter: HubActionFormatter,
    },
  },
};
