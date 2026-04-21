import { InstanceEditCtlFormatter, InstanceSelectCtlFormatter, InstanceTitleFormatter } from '../../formatters';

export const instancesTableConfig: SearchResultsTableConfig = {
  columns: {
    selectCtl: {
      label: '',
      position: 0,
      className: 'table-head-empty',
      formatter: InstanceSelectCtlFormatter,
    },
    title: {
      label: 'ld.title',
      position: 1,
      formatter: InstanceTitleFormatter,
    },
    isbn: {
      label: 'ld.isbn',
      position: 2,
    },
    lccn: {
      label: 'ld.lccn',
      position: 3,
    },
    publisher: {
      label: 'ld.publisher',
      position: 4,
    },
    pubDate: {
      label: 'ld.pubDateShort',
      position: 5,
    },
    editCtl: {
      label: '',
      position: 6,
      className: 'table-head-empty',
      formatter: InstanceEditCtlFormatter,
    },
  },
};
