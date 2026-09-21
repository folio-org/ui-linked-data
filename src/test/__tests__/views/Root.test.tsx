import { useRoutePathPattern } from '@/test/__mocks__/common/hooks/useRoutePathPattern.mock';
import '@/test/__mocks__/components/Loading.mock';
import '@/test/__mocks__/features/hubImport/hooks/useHubQuery.mock';
import '@/test/__mocks__/features/resources/hooks/useRecordMutations.mock';
import '@/test/__mocks__/features/resources/hooks/useResourcePreviewQuery.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Root } from '@/views';

import { useLoadingStateStore } from '@/store';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

useRoutePathPattern.mockImplementation(() => null);

describe('Root', () => {
  function renderRootComponent(isLoading = false) {
    setInitialGlobalState([
      {
        store: useLoadingStateStore,
        state: { isLoading },
      },
    ]);

    return render(
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

  describe('accessibility', () => {
    test.each([
      ['default', false],
      ['loading', true],
    ])('has no accessibility violations when %s', async (_description, isLoading) => {
      const { container } = renderRootComponent(isLoading);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
