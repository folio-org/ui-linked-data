import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchTypeSelect } from '@components/SearchTypeSelect';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

// TODO: remove router wrappings once <Link /> in <SearchTypeSelect /> is replaced with <Button />
describe('SearchTypeSelect', () => {
  const { getByTestId } = screen;
  const searchBy = 'lccn' as SearchIdentifiers | null;
  const setSearchBy = jest.fn();
  const clearMessage = jest.fn();
  const id = 'lccn';

  beforeEach(() => {
    render(
      <BrowserRouter>
        <RecoilRoot>
          <SearchTypeSelect searchBy={searchBy} setSearchBy={setSearchBy} clearMessage={clearMessage} />
        </RecoilRoot>
      </BrowserRouter>,
    );
  });

  test('renders SearchTypeSelect component', () => {
    expect(getByTestId('id-search-type-select')).toBeInTheDocument();
  });

  test('invokes passed function', () => {
    const searchControl = screen.getByTestId(id);

    fireEvent.click(searchControl);

    waitFor(() => {
      expect(clearMessage).toHaveBeenCalled();
      expect(setSearchBy).toHaveBeenCalledWith(id);
    });
  });
});
