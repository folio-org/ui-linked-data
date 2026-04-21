import { setInitialGlobalState } from '@/test/__mocks__/store';

import { fireEvent, render, screen } from '@testing-library/react';

import { useSearchStore } from '@/store';

import { SearchBySelect } from './SearchBySelect';

const mockConfig = {
  id: 'test',
};

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    config: mockConfig,
    activeUIConfig: {
      features: {
        hasSearchBy: true,
      },
      searchableIndices: [
        { value: 'keyword', labelId: 'ld.keyword' },
        { value: 'title', labelId: 'ld.title' },
        { value: 'author', labelId: 'ld.author' },
      ],
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
