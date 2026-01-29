import { fireEvent, render, screen } from '@testing-library/react';

import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useSearchStore } from '@/store';

import { SubmitButton } from './SubmitButton';

const mockOnSubmit = jest.fn();

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    activeUIConfig: {
      features: {
        hasSubmitButton: true,
      },
    },
    onSubmit: mockOnSubmit,
  }),
}));

describe('SubmitButton', () => {
  test('renders submit button when feature is enabled', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
        },
      },
    ]);

    render(<SubmitButton />);

    expect(screen.getByTestId('id-search-button')).toBeInTheDocument();
    expect(screen.getByText('ld.search')).toBeInTheDocument();
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

    render(<SubmitButton />);

    const button = screen.getByTestId('id-search-button');
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

    render(<SubmitButton />);

    const button = screen.getByTestId('id-search-button');
    expect(button).toBeDisabled();
  });

  test('calls onSubmit when clicked', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
        },
      },
    ]);

    render(<SubmitButton />);

    const button = screen.getByTestId('id-search-button');
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('does not call onSubmit when button is disabled', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
        },
      },
    ]);

    render(<SubmitButton />);

    const button = screen.getByTestId('id-search-button');
    fireEvent.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('applies correct CSS classes', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test',
        },
      },
    ]);

    render(<SubmitButton />);

    const button = screen.getByTestId('id-search-button');
    expect(button).toHaveClass('search-button', 'primary-search');
  });
});
