import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBySelect } from './SearchBySelect';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';

const mockConfig = {
  id: 'test',
  searchBy: {
    searchableIndices: [{ value: 'keyword' }, { value: 'title' }, { value: 'author' }],
  },
};

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    config: mockConfig,
    activeUIConfig: {
      features: {
        hasSearchBy: true,
      },
    },
  }),
}));

describe('SearchBySelect', () => {
  test('renders select with searchable indices', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          searchBy: 'keyword',
          setSearchBy: jest.fn(),
        },
      },
    ]);

    render(<SearchBySelect />);

    expect(screen.getByTestId('id-search-select')).toBeInTheDocument();
  });

  test('displays current searchBy value', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          searchBy: 'title',
          setSearchBy: jest.fn(),
        },
      },
    ]);

    render(<SearchBySelect />);

    const select = screen.getByTestId('id-search-select');
    expect(select).toHaveValue('title');
  });

  test('calls setSearchBy when value changes', () => {
    const mockSetSearchBy = jest.fn();

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          searchBy: 'keyword',
          setSearchBy: mockSetSearchBy,
        },
      },
    ]);

    render(<SearchBySelect />);

    const select = screen.getByTestId('id-search-select');
    fireEvent.change(select, { target: { value: 'author' } });

    expect(mockSetSearchBy).toHaveBeenCalled();
  });

  test('renders with correct CSS class', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          searchBy: 'keyword',
          setSearchBy: jest.fn(),
        },
      },
    ]);

    render(<SearchBySelect />);

    const select = screen.getByTestId('id-search-select');
    expect(select).toHaveClass('select-input');
  });

  test('renders with withIntl prop', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          searchBy: 'keyword',
          setSearchBy: jest.fn(),
        },
      },
    ]);

    render(<SearchBySelect />);

    // Select component with withIntl should be rendered
    expect(screen.getByTestId('id-search-select')).toBeInTheDocument();
  });

  test('has correct id attribute', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          searchBy: 'keyword',
          setSearchBy: jest.fn(),
        },
      },
    ]);

    render(<SearchBySelect />);

    const select = screen.getByTestId('id-search-select');
    expect(select).toHaveAttribute('id', 'id-search-select');
  });
});
