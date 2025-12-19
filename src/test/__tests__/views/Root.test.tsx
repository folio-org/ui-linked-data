import '@src/test/__mocks__/components/Loading.mock';
import '@src/test/__mocks__/common/hooks/useConfig.mock';
import { useRoutePathPattern } from '@src/test/__mocks__/common/hooks/useRoutePathPattern.mock';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useLoadingStateStore } from '@src/store';
import { Root } from '@views';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

useRoutePathPattern.mockImplementation(() => null);

describe('Root', () => {
  function renderRootComponent(isLoading = false) {
    setInitialGlobalState([
      {
        store: useLoadingStateStore,
        state: { isLoading },
      },
    ]);

    render(
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Root />} />
        </Routes>
      </BrowserRouter>,
    );
  }

  const { getByTestId, queryByTestId } = screen;

  test('renders Root component', () => {
    renderRootComponent();

    expect(getByTestId('root')).toBeInTheDocument();
    expect(queryByTestId('loading-component')).not.toBeInTheDocument();
  });

  test('renders Root with Loading component', () => {
    renderRootComponent(true);

    expect(getByTestId('loading-component')).toBeInTheDocument();
  });
});
