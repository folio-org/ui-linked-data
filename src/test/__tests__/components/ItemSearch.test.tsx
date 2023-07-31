import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ItemSearch } from '@components/ItemSearch';
import { getByIdentifier } from '@common/api/search.api';

jest.mock('@common/api/search.api', () => ({
  ...jest.requireActual('@common/api/search.api'),
  getByIdentifier: jest.fn(),
}));

describe('Item Search', () => {
  const id = 'lccn';

  beforeEach(() => render(<ItemSearch />));

  test('renders Item Search component', () => {
    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });

  test('triggers search control', () => {
    const ctl = screen.getByTestId(id);

    fireEvent.click(ctl);
    expect(ctl).toBeChecked();
  });

  test('searches the selected identifier for query', () => {
    const ctl = screen.getByTestId(id);
    const event = {
      target: {
        value: 'test',
      },
    };

    fireEvent.click(ctl);
    fireEvent.change(screen.getByTestId('id-search-input'), event);
    fireEvent.click(screen.getByTestId('id-search-button'));
    expect(getByIdentifier).toHaveBeenCalledWith(id, event.target.value);
  });
});
