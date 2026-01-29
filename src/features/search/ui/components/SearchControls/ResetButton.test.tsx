import { fireEvent, render, screen } from '@testing-library/react';

import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useSearchStore } from '@/store';

import { ResetButton } from './ResetButton';

const mockOnReset = jest.fn();

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    onReset: mockOnReset,
  }),
}));

jest.mock('@/assets/x-in-circle.svg?react', () => ({
  __esModule: true,
  default: () => <div data-testid="x-in-circle-icon">XIcon</div>,
}));

describe('ResetButton', () => {
  test('renders reset button', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
        },
      },
    ]);

    render(<ResetButton />);

    expect(screen.getByTestId('id-search-reset-button')).toBeInTheDocument();
    expect(screen.getByText('ld.reset')).toBeInTheDocument();
  });

  test('renders with icon prefix', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
        },
      },
    ]);

    render(<ResetButton />);

    expect(screen.getByTestId('x-in-circle-icon')).toBeInTheDocument();
  });

  test('button is enabled when query exists', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
        },
      },
    ]);

    render(<ResetButton />);

    const button = screen.getByTestId('id-search-reset-button');
    expect(button).not.toBeDisabled();
  });

  test('button is disabled when query is empty', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
        },
      },
    ]);

    render(<ResetButton />);

    const button = screen.getByTestId('id-search-reset-button');
    expect(button).toBeDisabled();
  });

  test('calls onReset when clicked', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
        },
      },
    ]);

    render(<ResetButton />);

    const button = screen.getByTestId('id-search-reset-button');
    fireEvent.click(button);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('does not call onReset when button is disabled', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
        },
      },
    ]);

    render(<ResetButton />);

    const button = screen.getByTestId('id-search-reset-button');
    fireEvent.click(button);

    expect(mockOnReset).not.toHaveBeenCalled();
  });

  test('applies correct CSS class', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test',
        },
      },
    ]);

    render(<ResetButton />);

    const button = screen.getByTestId('id-search-reset-button');
    expect(button).toHaveClass('search-button');
  });

  test('has correct aria label', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test',
        },
      },
    ]);

    render(<ResetButton />);

    const button = screen.getByTestId('id-search-reset-button');
    expect(button).toHaveAttribute('aria-label');
  });
});
