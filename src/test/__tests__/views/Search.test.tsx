import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useSearchStore, useUIStore } from '@src/store';
import { Search } from '@views';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('Search', () => {
  beforeEach(() =>
    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>,
    ),
  );

  test('renders Search component', () => {
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  test('renders child ItemSearch component', () => {
    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });

  describe('component unmount', () => {
    test('clears fullDisplayComponentType and selectedInstances on unmount', () => {
      const mockResetFullDisplayComponentType = jest.fn();
      const mockResetSelectedInstances = jest.fn();

      setInitialGlobalState([
        {
          store: useUIStore,
          state: {
            resetFullDisplayComponentType: mockResetFullDisplayComponentType,
          },
        },
        {
          store: useSearchStore,
          state: {
            resetSelectedInstances: mockResetSelectedInstances,
          },
        },
      ]);

      const { unmount } = render(
        <BrowserRouter>
          <Search />
        </BrowserRouter>,
      );

      unmount();

      expect(mockResetFullDisplayComponentType).toHaveBeenCalled();
      expect(mockResetSelectedInstances).toHaveBeenCalled();
    });
  });
});
