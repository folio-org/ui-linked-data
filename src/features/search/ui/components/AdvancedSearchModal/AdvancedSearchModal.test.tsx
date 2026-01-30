import { fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useUIStore, useSearchStore } from '@/store';
import { AdvancedSearchModal } from './AdvancedSearchModal';

const setSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [{}, setSearchParams],
}));

describe('AdvancedSearchModal', () => {
  beforeAll(() => {
    createModalContainer();
  });

  const renderModal = (navigationState = {}) => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: { isAdvancedSearchOpen: true },
      },
    ]);

    if (Object.keys(navigationState).length > 0) {
      setInitialGlobalState([
        {
          store: useUIStore,
          state: { isAdvancedSearchOpen: true },
        },
        {
          store: useSearchStore,
          state: { navigationState },
        },
      ]);
    }

    return render(
      <RouterProvider
        router={createMemoryRouter([
          {
            path: '/',
            element: <AdvancedSearchModal />,
          },
        ])}
      />,
    );
  };

  test('toggles isOpen', () => {
    renderModal();
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('preserves segment in URL params on submit', () => {
    renderModal({ segment: 'authorities', source: undefined });

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(setSearchParams).toHaveBeenCalled();
    const urlParams = setSearchParams.mock.calls[0][0];

    expect(urlParams.get('segment')).toBe('authorities');
    expect(urlParams.get('query')).toBe('(title all "testQuery")');
    expect(urlParams.has('searchBy')).toBe(false); // No searchBy for advanced search
  });

  test('preserves source in URL params on submit', () => {
    renderModal({ segment: 'hubs', source: 'external' });

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    const urlParams = setSearchParams.mock.calls[0][0];

    expect(urlParams.get('segment')).toBe('hubs');
    expect(urlParams.get('source')).toBe('external');
    expect(urlParams.get('query')).toBe('(title all "testQuery")');
  });

  test('preserves offset in URL params on submit', () => {
    renderModal({ segment: 'resources', offset: 100 });

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    const urlParams = setSearchParams.mock.calls[0][0];

    expect(urlParams.get('offset')).toBe('100');
  });

  test('does not include searchBy param for advanced search', () => {
    renderModal({ segment: 'authorities' });

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    const urlParams = setSearchParams.mock.calls[0][0];

    expect(urlParams.has('searchBy')).toBe(false);
  });

  test('resets query and searchBy before submitting', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const useSearchStore = require('@/store').useSearchStore;
    const resetQuery = jest.fn();
    const resetSearchBy = jest.fn();

    setInitialGlobalState([
      {
        store: useUIStore,
        state: { isAdvancedSearchOpen: true },
      },
      {
        store: useSearchStore,
        state: {
          navigationState: { segment: 'resources' },
          resetQuery,
          resetSearchBy,
        },
      },
    ]);

    render(
      <RouterProvider
        router={createMemoryRouter([
          {
            path: '/',
            element: <AdvancedSearchModal />,
          },
        ])}
      />,
    );

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(resetQuery).toHaveBeenCalled();
    expect(resetSearchBy).toHaveBeenCalled();
  });

  test('formats query correctly for multiple rows', () => {
    renderModal({ segment: 'authorities' });

    fireEvent.change(screen.getByTestId('text-input-0'), { target: { value: 'first' } });
    fireEvent.change(screen.getByTestId('text-input-1'), { target: { value: 'second' } });
    fireEvent.change(screen.getByTestId('select-operators-1'), { target: { value: 'and' } });
    fireEvent.change(screen.getByTestId('select-qualifiers-1'), { target: { value: 'contains' } });
    fireEvent.change(screen.getByTestId('select-identifiers-1'), { target: { value: 'title' } });

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    const urlParams = setSearchParams.mock.calls[0][0];
    const query = urlParams.get('query');

    expect(query).toContain('first');
    expect(query).toContain('second');
    expect(query).toContain('and');
  });

  test('handles missing segment gracefully', () => {
    renderModal({});

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    const urlParams = setSearchParams.mock.calls[0][0];

    expect(urlParams.has('segment')).toBe(false);
    expect(urlParams.get('query')).toBe('(title all "testQuery")');
  });

  test('closes modal after successful submit', () => {
    renderModal({ segment: 'authorities' });

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('closes modal and resets form on cancel', () => {
    renderModal({ segment: 'authorities' });

    const inputEvent = { target: { value: 'testQuery' } };
    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    expect(setSearchParams).not.toHaveBeenCalled();
  });
});
