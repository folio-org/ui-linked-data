import '@src/test/__mocks__/common/hooks/useRoutePathPattern.mock';
import '@src/test/__mocks__/components/Loading.mock';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useRoutePathPattern } from '@src/test/__mocks__/common/hooks/useRoutePathPattern.mock';
import { RecoilRoot } from 'recoil';
import { Root } from '@views';
import state from '@state';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

useRoutePathPattern.mockImplementation(() => {});

describe('Root', () => {
  function renderRootComponent(isLoading = false) {
    render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.loadingState.isLoading, isLoading)}>
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
