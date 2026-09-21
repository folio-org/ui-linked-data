import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

    const button = screen.getByTestId('id-search-reset-button');
    expect(button).toBeDisabled();
  });

  test('button is enabled when advanced search is active', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
        },
      },
    ]);

    render(
      <MemoryRouter initialEntries={['/?query=title+adj+value']}>
        <ResetButton />
      </MemoryRouter>,
    );

    const button = screen.getByTestId('id-search-reset-button');
    expect(button).not.toBeDisabled();
  });

  test('button is disabled when query is empty and no advanced search is active', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
        },
      },
    ]);

    render(
      <MemoryRouter initialEntries={['/?query=some+query&searchBy=title']}>
        <ResetButton />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter>
        <ResetButton />
      </MemoryRouter>,
    );

    const button = screen.getByTestId('id-search-reset-button');
    expect(button).toHaveAttribute('aria-label');
  });

  describe('accessibility', () => {
    test.each([
      ['query exists', 'test query', ['/']],
      ['query is empty', '', ['/']],
      ['advanced search is active', '', ['/?query=title+adj+value']],
      ['query empty and no advanced search active', '', ['/?query=some+query&searchBy=title']],
    ])('has no accessibility violations when %s', async (_description, query, initialEntries) => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query,
          },
        },
      ]);

      const { container } = render(
        <MemoryRouter initialEntries={initialEntries}>
          <ResetButton />
        </MemoryRouter>,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
