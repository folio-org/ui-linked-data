import { authoritiesTableConfig } from '@components/ComplexLookupField/configs/Authorities';
import { AssignFormatter, AuthorizedFormatter, TitleFormatter } from '@components/ComplexLookupField/formatters';

jest.mock('@components/ComplexLookupField/formatters', () => ({
  AssignFormatter: jest.fn(),
  AuthorizedFormatter: jest.fn(),
  TitleFormatter: jest.fn(),
}));

describe('authoritiesTableConfig', () => {
  it('has the correct columns configuration', () => {
    const { columns } = authoritiesTableConfig;
    const mockAssignFormatter = AssignFormatter;
    const mockAuthorizedFormatter = AuthorizedFormatter;
    const mockTitleFormatter = TitleFormatter;

    expect(columns).toEqual({
      assign: {
        label: '',
        position: 0,
        className: 'cell-fixed cell-fixed-100',
        formatter: mockAssignFormatter,
      },
      authorized: {
        label: 'ld.authorizedReference',
        position: 1,
        className: 'cell-fixed cell-fixed-170',
        formatter: mockAuthorizedFormatter,
      },
      title: {
        label: 'ld.headingReference',
        position: 2,
        className: 'cell-fixed cell-fixed-370',
        formatter: mockTitleFormatter,
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
    });
  });
});
