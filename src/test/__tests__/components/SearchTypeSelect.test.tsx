import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchTypeSelect } from '@components/SearchTypeSelect';
import { SearchIdentifiers } from '@common/constants/search.constants';

describe('SearchTypeSelect', () => {
  const { getByTestId } = screen;
  const searchBy = 'lccn' as SearchIdentifiers | null;
  const setSearchBy = jest.fn();
  const clearMessage = jest.fn();
  const id = 'lccn';

  beforeEach(() => {
    render(<SearchTypeSelect searchBy={searchBy} setSearchBy={setSearchBy} clearMessage={clearMessage} />);
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
