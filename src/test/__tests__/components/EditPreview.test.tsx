import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { EditPreview } from '@components/EditPreview';
import state from '@state';
import { fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('EditPreview', () => {
  beforeEach(() => {
    render(
      <RecoilRoot
        initializeState={snapshot =>
          snapshot.set(state.ui.currentlyPreviewedEntityBfid, new Set([PROFILE_BFIDS.INSTANCE]))
        }
      >
        <RouterProvider router={createMemoryRouter([{ path: '/', element: <EditPreview /> }])} />
      </RecoilRoot>,
    );
  });

  const { getByTestId } = screen;

  test('navigates to add new instance sceen', () => {
    fireEvent.click(getByTestId('create-instance-button'));

    expect(navigate).toHaveBeenCalled();
  });
});
