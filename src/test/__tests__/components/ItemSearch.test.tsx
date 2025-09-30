import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { getCurrentPageNumber } from '@src/test/__mocks__/common/hooks/usePagination.mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ItemSearch } from '@components/ItemSearch';
import * as searchApi from '@common/api/search.api';
import { Edit } from '@views';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { SearchContext } from '@src/contexts';
import { useSearchStore, useUIStore, useInputsStore } from '@src/store';

let getByIdentifierMock: jest.SpyInstance<
  Promise<unknown>,
  [id: string, query: string, endpointUrl: string, isSortedResults?: boolean, offset?: string, limit?: string],
  unknown
>;

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

let mockSearchBy = 'lccn';
let mockQuery = '';

const mockSubmitSearch = jest.fn();
const mockClearValues = jest.fn();
const mockOnChangeSegment = jest.fn();

jest.mock('@common/hooks/useSearch', () => ({
  useSearch: () => ({
    submitSearch: mockSubmitSearch,
    clearValues: mockClearValues,
    onPrevPageClick: jest.fn(),
    onNextPageClick: jest.fn(),
    currentPageNumber: 1,
    pageMetadata: { totalElements: 2, totalPages: 1 },
    message: '',
    data: [],
    fetchData: jest.fn(),
    onChangeSegment: mockOnChangeSegment,
  }),
}));

export const itemSearchMockData = {
  searchQuery: 'isbn=12345*',
  content: [
    {
      id: 'workId',
      titles: [
        {
          value: 'Work Title Value',
          type: 'Main',
        },
        {
          value: 'Work Sub Title Value',
          type: 'Sub',
        },
        {
          value: 'Work Parallel Title Value',
          type: 'Main Parallel',
        },
      ],
      contributors: [
        {
          name: 'John Doe',
          type: 'Person',
          isCreator: true,
        },
      ],
      languages: ['eng'],
      classifications: [
        {
          number: '1234',
          source: 'ddc',
        },
      ],
      publications: [
        {
          name: 'name Name',
          date: '2022',
        },
      ],
      subjects: ['Subject'],
      instances: [
        {
          id: 'instanceId',
          titles: [
            {
              value: 'Instance Title Value',
              type: 'Main',
            },
            {
              value: 'Instance Sub Title Value',
              type: 'Sub',
            },
            {
              value: 'Instance Parallel Title Value',
              type: 'Sub Parallel',
            },
          ],
          identifiers: [
            {
              value: '12345678901234567',
              type: 'ISBN',
            },
          ],
          contributors: [
            {
              name: 'John Doe',
              type: 'Person',
              isCreator: true,
            },
          ],
          publications: [
            {
              name: 'name Name',
              date: '2022',
            },
          ],
          editionStatements: ['Edition 1'],
        },
      ],
    },
  ],
};

describe('Item Search', () => {
  const id = 'lccn';
  const event = {
    target: {
      value: '1234-1',
    },
  };

  const { getByTestId, findByText } = screen;
  let mockSetQuery: jest.Mock;
  let mockSetSearchBy: jest.Mock;

  beforeEach(() => {
    mockSearchBy = 'lccn';
    mockQuery = '';

    mockSubmitSearch.mockClear();

    mockSetSearchBy = jest.fn((value: string) => {
      mockSearchBy = value;
    });
    mockSetQuery = jest.fn((value: string) => {
      mockQuery = value;
    });
    const mockSetMessage = jest.fn();

    getByIdentifierMock = (jest.spyOn(searchApi, 'getByIdentifier') as jest.Mock).mockImplementation(() =>
      Promise.resolve(null),
    );
    getCurrentPageNumber.mockReturnValue(1);

    window.history.pushState({}, '', '/');

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: { totalElements: 2, totalPages: 1 },
          get query() {
            return mockQuery;
          },
          get searchBy() {
            return mockSearchBy;
          },
          data: [],
          setQuery: mockSetQuery,
          setSearchBy: mockSetSearchBy,
          setMessage: mockSetMessage,
          setData: jest.fn(),
          setNavigationState: jest.fn(),
          resetFacets: jest.fn(),
          setFacetsBySegments: jest.fn(),
          resetSelectedInstances: jest.fn(),
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: jest.fn(),
          setIsAdvancedSearchOpen: jest.fn(),
          resetFullDisplayComponentType: jest.fn(),
        },
      },
      {
        store: useInputsStore,
        state: {
          resetPreviewContent: jest.fn(),
        },
      },
    ]);
    const searchContext = {
      searchByControlOptions: ['keyword', 'title', 'lccn', 'isbn'],
      defaultSearchBy: 'lccn',
      isVisibleSearchByControl: true,
      hasSearchParams: false,
      renderSearchControlPane: () => <div data-testid="search-control-pane" />,
      renderResultsList: () => null,
      renderMarcPreview: () => null,
    } as SearchParams;

    render(
      <SearchContext.Provider value={searchContext}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<ItemSearch />} />
            <Route path="/edit" element={<Edit />} />
          </Routes>
        </BrowserRouter>
      </SearchContext.Provider>,
    );
  });

  test('renders Item Search component', () => {
    expect(getByTestId('id-search')).toBeInTheDocument();
  });

  test('triggers search control', async () => {
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('lccn');

    fireEvent.change(select, { target: { value: 'isbn' } });

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'ld.isbn' })).toBeInTheDocument();
    });
  });

  test('searches the selected identifier for query', async () => {
    const input = getByTestId('id-search-input');
    const button = getByTestId('id-search-button');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    fireEvent.change(input, event);

    await waitFor(() => {
      expect(mockSetQuery).toHaveBeenCalledWith(event.target.value);
    });

    fireEvent.click(button);

    expect(input).toHaveAttribute('data-testid', 'id-search-input');
    expect(button).toHaveAttribute('data-testid', 'id-search-button');
  });

  test('returns message if the response is empty', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve({ ...itemSearchMockData, content: [] }));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByTestId('id-search-button')).toBeInTheDocument();
    });
    expect(getByTestId('id-search-input')).toBeInTheDocument();
  });
});
