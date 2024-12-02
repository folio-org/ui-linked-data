import '@src/test/__mocks__/components/Loading.mock';
import { useRoutePathPattern } from '@src/test/__mocks__/common/hooks/useRoutePathPattern.mock';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useLoadingStateStore } from '@src/store';
import { Root } from '@views';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

useRoutePathPattern.mockImplementation(() => null);

describe('Root', () => {
  function renderRootComponent(isLoading = false) {
    setInitialGlobalState(useLoadingStateStore, { isLoading });

    render(
      <RecoilRoot>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Root />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>,
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
