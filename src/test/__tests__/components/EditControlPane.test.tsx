import { navigateAsDuplicate } from '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { EditControlPane } from '@components/EditControlPane';
import { act, fireEvent, render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import * as recordsApi from '@common/api/records.api';
import { ROUTES } from '@common/constants/routes.constants';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useUIStore } from '@src/store';

const renderWrapper = (withDropdown = true) => {
  const path = withDropdown ? ROUTES.RESOURCE_EDIT.uri : ROUTES.RESOURCE_CREATE.uri;

  setInitialGlobalState([
    {
      store: useUIStore,
      state: { currentlyEditedEntityBfid: new Set([PROFILE_BFIDS.INSTANCE]) },
    },
  ]);

  return render(
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
    />,
  );
};

describe('EditControlPane', () => {
  test('fetches MARC data', async () => {
    const getMarcRecordMock = (jest.spyOn(recordsApi, 'getMarcRecord') as any).mockImplementation(() =>
      Promise.resolve(null),
    );

    const { findByText, findByTestId } = renderWrapper();

    await act(async () => {
      fireEvent.click(await findByTestId('edit-control-actions-toggle'));
      fireEvent.click(await findByText('ld.viewMarc'));
    });

    expect(getMarcRecordMock).toHaveBeenCalled();
  });

  test('handles duplicate resource navigation', async () => {
    const { findByText, findByTestId } = renderWrapper();

    await act(async () => {
      fireEvent.click(await findByTestId('edit-control-actions-toggle'));
      fireEvent.click(await findByText('ld.duplicate'));
    });

    expect(navigateAsDuplicate).toHaveBeenCalled();
  });

  test("doesn't render actions dropdown in create mode", () => {
    const { queryByText } = renderWrapper(false);

    expect(queryByText('ld.actions')).not.toBeInTheDocument();
  });

  test('fetches RDF data', async () => {
    const getRdfRecordMock = (jest.spyOn(recordsApi, 'getRdfRecord') as any).mockImplementation(() =>
      Promise.resolve(null),
    );

    const { findByText, findByTestId } = renderWrapper();

    await act(async () => {
      fireEvent.click(await findByTestId('edit-control-actions-toggle'));
      fireEvent.click(await findByText('ld.exportInstanceRdf'));
    });

    expect(getRdfRecordMock).toHaveBeenCalled();
  });
});
