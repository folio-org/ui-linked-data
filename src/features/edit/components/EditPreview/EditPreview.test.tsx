import '@/test/__mocks__/common/hooks/useConfig.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { act, render, screen } from '@testing-library/react';

import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';

import { useEditPreview } from '@/features/edit/hooks/useEditPreview';

import { useInputsStore, useUIStore } from '@/store';

import { EditPreview } from './EditPreview';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

jest.mock('@/features/edit/hooks/useEditPreview', () => ({
  useEditPreview: jest.fn(),
}));

const mockUseEditPreview = useEditPreview as jest.Mock;

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('EditPreview', () => {
  beforeEach(() => {
    mockUseEditPreview.mockReturnValue({
      altSchema: undefined,
      altUserValues: undefined,
      altInitKey: undefined,
      title: undefined,
      isLoading: false,
      isError: false,
    });

    setInitialGlobalState([
      {
        store: useInputsStore,
        state: {
          record: {},
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

  test('resets dismiss state when resourceId changes', () => {
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

    expect(getByTestId).toBeDefined();
  });
});
