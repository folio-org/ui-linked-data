import { EditControlPane } from '@components/EditControlPane';
import { fireEvent, render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { RecoilRoot } from 'recoil';
import * as recordsApi from '@common/api/records.api';
import { ROUTES } from '@common/constants/routes.constants';
import state from '@state';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';

const renderWrapper = (withDropdown = true) => {
  const path = withDropdown ? ROUTES.RESOURCE_EDIT.uri : ROUTES.RESOURCE_CREATE.uri;

  return render(
    <RecoilRoot
      initializeState={snapshot => snapshot.set(state.ui.currentlyEditedEntityBfid, new Set([PROFILE_BFIDS.INSTANCE]))}
    >
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path,
              element: <EditControlPane />,
            },
          ],
          { initialEntries: [path] },
        )}
      />
    </RecoilRoot>,
  );
};

describe('EditControlPane', () => {
  test('fetches MARC data', async () => {
    const getMarcRecordMock = (jest.spyOn(recordsApi, 'getMarcRecord') as any).mockImplementation(() =>
      Promise.resolve(null),
    );
    
    const { findByText, findByTestId } = renderWrapper();

    fireEvent.click(await findByTestId('edit-control-actions-toggle'));
    fireEvent.click(await findByText('marva.viewMarc'));

    expect(getMarcRecordMock).toHaveBeenCalled();
  });

  test("doesn't render actions dropdown in create mode", () => {
    const { queryByText } = renderWrapper(false);

    expect(queryByText('marva.actions')).not.toBeInTheDocument();
  });
});
