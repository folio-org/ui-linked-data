import '@src/test/__mocks__/common/hooks/useConfig.mock';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LegacySearchResultList } from '@/features/search/ui';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore, useUIStore } from '@/store';
import { itemSearchMockData } from '@/features/search/ui/components/Search/legacy/ItemSearch/ItemSearch.test';

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
    ]);

    render(
      <BrowserRouter>
        <LegacySearchResultList />
      </BrowserRouter>,
    );
  });

  const { getByText } = screen;

  test('renders the list', () => {
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});
