import { AssignFormatter, AuthorizedFormatter, TitleFormatter } from '@/features/search/ui/formatters';

export const authoritiesTableConfig: SearchResultsTableConfig = {
  columns: {
    assign: {
      label: '',
      position: 0,
      className: 'cell-fixed',
      minWidth: 100,
      formatter: AssignFormatter,
    },
    authorized: {
      label: 'ld.authorizedReference',
      position: 1,
      className: 'cell-fixed',
      minWidth: 170,
      formatter: AuthorizedFormatter,
    },
    title: {
      label: 'ld.headingReference',
      position: 2,
      className: 'cell-fixed',
      minWidth: 370,
      formatter: TitleFormatter,
    },
    subclass: {
      label: 'ld.typeOfHeading',
      position: 3,
      className: 'cell-fixed',
      minWidth: 140,
    },
    authoritySource: {
      label: 'ld.authoritySource',
      position: 4,
      className: 'cell-fixed',
      minWidth: 250,
    },
  },
};
