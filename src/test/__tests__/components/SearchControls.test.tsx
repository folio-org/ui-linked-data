import { fireEvent, render, screen } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import * as FeatureConstants from '@common/constants/feature.constants';
import { SearchControls } from '@components/SearchControls';
import { SearchContext } from '@src/contexts';
import { useInputsStore, useSearchStore, useUIStore } from '@src/store';

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
        <SearchContext.Provider value={{ isVisibleFilters: true } as unknown as SearchParams}>
          <SearchControls submitSearch={jest.fn} clearValues={jest.fn} changeSegment={jest.fn} />
        </SearchContext.Provider>,
      );

      expect(getByTestId('search-filters')).toBeInTheDocument();
    });

    test('does not render SearchFilters component', () => {
      mockedSearchFiltersEnabled(false);

      const { queryByTestId } = render(
        <SearchControls submitSearch={jest.fn} clearValues={jest.fn} changeSegment={jest.fn} />,
      );

      expect(queryByTestId('search-filters')).not.toBeInTheDocument();
    });
  });

  describe('Reset button', () => {
    const defaultSearchBy = 'testSearchBy';
    const mockClearValues = jest.fn();
    const mockResetFacets = jest.fn();
    const mockSetSearchBy = jest.fn();
    const mockResetPreviewContent = jest.fn();
    const mockResetFullDisplayComponentType = jest.fn();
    const mockResetSelectedInstances = jest.fn();

    function renderSearchControls(searchParams: URLSearchParams, queryState: string) {
      (useSearchParams as jest.Mock).mockReturnValue([searchParams, setSearchParams]);

      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: queryState,
            resetFacets: mockResetFacets,
            setSearchBy: mockSetSearchBy,
            resetSelectedInstances: mockResetSelectedInstances,
          },
        },
        {
          store: useUIStore,
          state: {
            resetFullDisplayComponentType: mockResetFullDisplayComponentType,
          },
        },
        {
          store: useInputsStore,
          state: { resetPreviewContent: mockResetPreviewContent },
        },
      ]);

      render(
        <SearchContext.Provider value={{ defaultSearchBy } as unknown as SearchParams}>
          <SearchControls submitSearch={jest.fn} clearValues={mockClearValues} changeSegment={jest.fn} />
        </SearchContext.Provider>,
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

    test('resets state', () => {
      renderSearchControls(new URLSearchParams({ query: 'test query' }), 'test state');

      fireEvent.click(screen.getByTestId('id-search-reset-button'));

      expect(mockClearValues).toHaveBeenCalled();
      expect(mockResetFacets).toHaveBeenCalled();
      expect(mockSetSearchBy).toHaveBeenCalledWith(defaultSearchBy);
      expect(mockResetPreviewContent).toHaveBeenCalled();
      expect(mockResetFullDisplayComponentType).toHaveBeenCalled();
      expect(mockResetSelectedInstances).toHaveBeenCalled();
    });
  });
});
