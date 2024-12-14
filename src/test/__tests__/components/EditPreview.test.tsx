import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { EditPreview } from '@components/EditPreview';
import { useInputsStore, useUIStore } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('EditPreview', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: { record: {} },
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
});
