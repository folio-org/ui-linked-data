import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { EditPreview } from '@components/EditPreview';
import state from '@state';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('EditPreview', () => {
  beforeEach(() => {
    render(
      <RecoilRoot
        initializeState={snapshot => {
          snapshot.set(state.ui.currentlyPreviewedEntityBfid, new Set([PROFILE_BFIDS.INSTANCE]));
          snapshot.set(state.inputs.record, {});
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

  test('contains instances list when create work page is opened', () => {
    expect(getByTestId('instances-list')).toBeInTheDocument();
  });
});
