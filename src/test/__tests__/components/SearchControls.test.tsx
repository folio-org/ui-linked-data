import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as FeatureConstants from '@common/constants/feature.constants';
import { SearchControls } from '@components/SearchControls';

const setSearchParams = jest.fn();
const mockSearchFiltersComponent = <div data-testid="search-filters" />;
const mockUseSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: mockUseSearchParams,
}));
jest.mock('@components/SearchFilters', () => ({
  SearchFilters: () => mockSearchFiltersComponent,
}));

describe('SearchControls', () => {
  const mockedSearchFiltersEnabled = getMockedImportedConstant(FeatureConstants, 'SEARCH_FILTERS_ENABLED');

  describe('', () => {
    beforeEach(() => {
      mockUseSearchParams.mockResolvedValue([{}, setSearchParams]);
    });

    test('renders SearchFilters component', () => {
      mockedSearchFiltersEnabled(true);

      const { getByTestId } = render(
        <RecoilRoot>
          <SearchControls submitSearch={jest.fn} clearValues={jest.fn} />
        </RecoilRoot>,
      );

      expect(getByTestId('search-filters')).toBeInTheDocument();
    });

    test('does not render SearchFilters component', () => {
      mockedSearchFiltersEnabled(false);

      const { queryByTestId } = render(
        <RecoilRoot>
          <SearchControls submitSearch={jest.fn} clearValues={jest.fn} />
        </RecoilRoot>,
      );

      expect(queryByTestId('search-filters')).not.toBeInTheDocument();
    });
  });

  /* describe('Reset button', () => {
    test('renders button enabled', () => {});

    test('renders button disabled', () => {});
  }); */
});
