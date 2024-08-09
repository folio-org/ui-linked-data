import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useSearchParams } from 'react-router-dom';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as FeatureConstants from '@common/constants/feature.constants';
import { SearchControls } from '@components/SearchControls';
import { SearchContext } from '@src/contexts';
import state from '@state';

const setSearchParams = jest.fn();
const mockSearchFiltersComponent = <div data-testid="search-filters" />;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));
jest.mock('@components/SearchFilters', () => ({
  SearchFilters: () => mockSearchFiltersComponent,
}));

describe('SearchControls', () => {
  const mockedSearchFiltersEnabled = getMockedImportedConstant(FeatureConstants, 'SEARCH_FILTERS_ENABLED');

  describe('SearchFilters component', () => {
    beforeEach(() => {
      (useSearchParams as jest.Mock).mockReturnValue([{ get: jest.fn() }, setSearchParams]);
    });

    test('renders SearchFilters component', () => {
      mockedSearchFiltersEnabled(true);

      const { getByTestId } = render(
        <RecoilRoot>
          <SearchContext.Provider value={{ isVisibleFilters: true }  as unknown as SearchParams}>
            <SearchControls submitSearch={jest.fn} clearValues={jest.fn} />
          </SearchContext.Provider>
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

  describe('Reset button', () => {
    function renderSearchControls(searchParams: URLSearchParams, queryState: string) {
      (useSearchParams as jest.Mock).mockReturnValue([searchParams, setSearchParams]);

      render(
        <RecoilRoot initializeState={snapshot => snapshot.set(state.search.query, queryState)}>
          <SearchControls submitSearch={jest.fn} clearValues={jest.fn} />
        </RecoilRoot>,
      );
    }

    test('renders button enabled if "query" search param and "query" state have values', () => {
      renderSearchControls(new URLSearchParams({ query: 'test query' }), 'test state');

      expect(screen.queryByTestId('id-search-reset-button')).not.toBeDisabled();
    });

    test('renders button enabled if "query" search param is empty', () => {
      renderSearchControls(new URLSearchParams(), 'test state');

      expect(screen.queryByTestId('id-search-reset-button')).not.toBeDisabled();
    });

    test('renders button enabled if "query" state is empty', () => {
      renderSearchControls(new URLSearchParams({ query: 'test query' }), '');

      expect(screen.queryByTestId('id-search-reset-button')).not.toBeDisabled();
    });

    test('renders button disabled', () => {
      renderSearchControls(new URLSearchParams(), '');

      expect(screen.queryByTestId('id-search-reset-button')).toBeDisabled();
    });
  });
});
