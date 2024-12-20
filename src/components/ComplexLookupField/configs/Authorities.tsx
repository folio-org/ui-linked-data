import { AssignFormatter, AuthorizedFormatter, TitleFormatter } from '../formatters';

export const authoritiesTableConfig: SearchResultsTableConfig = {
  columns: {
    assign: {
      label: '',
      position: 0,
      className: 'cell-fixed cell-fixed-100',
      formatter: AssignFormatter,
    },
    authorized: {
      label: 'ld.authorizedReference',
      position: 1,
      className: 'cell-fixed cell-fixed-170',
      formatter: AuthorizedFormatter,
    },
    title: {
      label: 'ld.headingReference',
      position: 2,
      className: 'cell-fixed cell-fixed-370',
      formatter: TitleFormatter,
    },
    subclass: {
      label: 'ld.typeOfHeading',
      position: 3,
      className: 'cell-fixed cell-fixed-140',
    },
    authoritySource: {
      label: 'ld.authoritySource',
      position: 4,
      className: 'cell-fixed cell-fixed-250',
    },
  },
};
