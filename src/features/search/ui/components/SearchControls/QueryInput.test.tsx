import { render, screen, fireEvent } from '@testing-library/react';
import { QueryInput } from './QueryInput';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';

const mockOnSubmit = jest.fn();

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    activeUIConfig: {
      features: {
        hasQueryInput: true,
        hasMultilineInput: false,
      },
      ui: {
        placeholderId: 'ld.searchPlaceholder',
      },
    },
    onSubmit: mockOnSubmit,
  }),
}));

describe('QueryInput', () => {
  test('renders single-line input by default', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
          setQuery: jest.fn(),
        },
      },
    ]);

    render(<QueryInput />);

    expect(screen.getByTestId('id-search-input')).toBeInTheDocument();
    expect(screen.queryByTestId('id-search-textarea')).not.toBeInTheDocument();
  });

  test('displays current query value', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'current query',
          setQuery: jest.fn(),
        },
      },
    ]);

    render(<QueryInput />);

    const input = screen.getByTestId('id-search-input');
    expect(input).toHaveValue('current query');
  });

  test('calls setQuery when input value changes', () => {
    const mockSetQuery = jest.fn();

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
          setQuery: mockSetQuery,
        },
      },
    ]);

    render(<QueryInput />);

    const input = screen.getByTestId('id-search-input');
    fireEvent.change(input, { target: { value: 'new query' } });

    expect(mockSetQuery).toHaveBeenCalledWith('new query');
  });

  test('calls onSubmit when Enter key is pressed', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test',
          setQuery: jest.fn(),
        },
      },
    ]);

    render(<QueryInput />);

    const input = screen.getByTestId('id-search-input');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('renders with placeholder from config', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
          setQuery: jest.fn(),
        },
      },
    ]);

    render(<QueryInput />);

    const input = screen.getByTestId('id-search-input');
    expect(input).toHaveAttribute('placeholder');
  });

  test('applies correct CSS class to input', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
          setQuery: jest.fn(),
        },
      },
    ]);

    render(<QueryInput />);

    const input = screen.getByTestId('id-search-input');
    expect(input).toHaveClass('text-input');
  });

  test('has correct id attribute', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
          setQuery: jest.fn(),
        },
      },
    ]);

    render(<QueryInput />);

    const input = screen.getByTestId('id-search-input');
    expect(input).toHaveAttribute('id', 'id-search-input');
  });

  test('has correct aria label', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
          setQuery: jest.fn(),
        },
      },
    ]);

    render(<QueryInput />);

    const input = screen.getByTestId('id-search-input');
    expect(input).toHaveAttribute('aria-label');
  });
});
