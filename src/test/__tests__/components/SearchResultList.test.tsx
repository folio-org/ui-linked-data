import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchResultList } from '@components/SearchResultList';
import { RecoilRoot } from 'recoil';
import state from '@state';
import { itemSearchMockData } from './ItemSearch.test';

describe('SearchResultList', () => {
  beforeEach(() =>
    render(
      <BrowserRouter>
        <RecoilRoot
          initializeState={snapshot =>
            snapshot.set(state.search.data, itemSearchMockData.content as unknown as WorkAsSearchResultDTO[])
          }
        >
          <SearchResultList />
        </RecoilRoot>
      </BrowserRouter>,
    ),
  );

  const { getByText } = screen;

  test('renders the list', () => {
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});
