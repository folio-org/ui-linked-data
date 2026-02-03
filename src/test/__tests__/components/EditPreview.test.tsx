import '@/test/__mocks__/common/hooks/useConfig.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { act, render, screen } from '@testing-library/react';

import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import { EditPreview } from '@/components/EditPreview';

import { useInputsStore, useUIStore } from '@/store';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('EditPreview', () => {
  const resetPreviewContent = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: {
          record: {},
          resetPreviewContent,
        },
      },
      {
        store: useUIStore,
        state: { currentlyPreviewedEntityBfid: new Set([PROFILE_BFIDS.INSTANCE]) },
      },
    ]);

    render(
      <RouterProvider
        router={createMemoryRouter([{ path: '/resources/create', element: <EditPreview /> }], {
          initialEntries: ['/resources/create?type=work'],
        })}
      />,
    );
  });

  const { getByTestId } = screen;

  test('contains instances list when create work page is opened', () => {
    expect(getByTestId('instances-list')).toBeInTheDocument();
  });

  test('calls resetPreviewContent when resourceId changes', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/resources/:resourceId/edit',
          element: <EditPreview />,
        },
      ],
      {
        initialEntries: ['/resources/123/edit'],
      },
    );

    const { rerender } = render(<RouterProvider router={router} />);

    act(() => {
      router.navigate('/resources/456/edit');
    });

    rerender(<RouterProvider router={router} />);

    expect(resetPreviewContent).toHaveBeenCalled();
  });
});
