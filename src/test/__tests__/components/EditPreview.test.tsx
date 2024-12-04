import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { EditPreview } from '@components/EditPreview';
import { useInputsStore } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
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
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: { record: {} },
      },
    ]);

    render(
      <RecoilRoot
        initializeState={snapshot => {
          snapshot.set(state.ui.currentlyPreviewedEntityBfid, new Set([PROFILE_BFIDS.INSTANCE]));
        }}
      >
        <RouterProvider
          router={createMemoryRouter([{ path: '/resources/create', element: <EditPreview /> }], {
            initialEntries: ['/resources/create?type=work'],
          })}
        />
      </RecoilRoot>,
    );
  });

  const { getByTestId } = screen;

  test('navigates to add new instance screen', () => {
    fireEvent.click(getByTestId('create-instance-button'));

    expect(navigate).toHaveBeenCalled();
  });

  test('contains instances list when create work page is opened', () => {
    expect(getByTestId('instances-list')).toBeInTheDocument();
  });
});
