import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchResultList } from '@components/SearchResultList';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useSearchStore, useUIStore, useInputsStore } from '@src/store';
import { itemSearchMockData } from './ItemSearch.test';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('SearchResultList', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { 
          data: itemSearchMockData.content as unknown as WorkAsSearchResultDTO[],
          query: '',
          searchBy: 'keyword',
          pageMetadata: { totalElements: 1, totalPages: 1 },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
        },
      },
      {
        store: useInputsStore,
        state: {},
      },
    ]);

    render(
      <BrowserRouter>
        <SearchResultList />
      </BrowserRouter>,
    );
  });

  const { getByText } = screen;

  test('renders the list', () => {
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});
