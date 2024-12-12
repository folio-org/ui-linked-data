import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Search } from '@views';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('Search', () => {
  beforeEach(() =>
    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>,
    ),
  );

  test('renders Search component', () => {
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  test('renders child ItemSearch component', () => {
    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });
});
