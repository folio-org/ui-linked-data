import { Search } from '@views';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';

describe('Search', () => {
  beforeEach(() => render(
    <RecoilRoot>
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    </RecoilRoot>
  ));

  test('renders Search component', () => {
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  test('renders child ItemSearch component', () => {
    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });
});
