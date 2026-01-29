import { RouterProvider, createMemoryRouter } from 'react-router';

import { fireEvent, render } from '@testing-library/react';

import * as recordsApi from '@/common/api/records.api';
import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import { ROUTES } from '@/common/constants/routes.constants';
import * as useProfileSelectionHook from '@/common/hooks/useProfileSelection';
import { EditControlPane } from '@/components/EditControlPane';
import { navigateAsDuplicate } from '@/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useInputsState, useUIStore } from '@/store';

const renderWrapper = (withDropdown = true, customState?: Parameters<typeof setInitialGlobalState>[0]) => {
  const path = withDropdown ? ROUTES.RESOURCE_EDIT.uri : ROUTES.RESOURCE_CREATE.uri;

  const defaultState = [
    {
      store: useUIStore,
      state: { currentlyEditedEntityBfid: new Set([PROFILE_BFIDS.INSTANCE]) },
    },
    {
      store: useInputsState,
      state: { selectedRecordBlocks: { block: 'test-block' } },
    },
  ];

  setInitialGlobalState(customState || defaultState);

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
    const getMarcRecordMock = jest.spyOn(recordsApi, 'getMarcRecord').mockImplementation(() => Promise.resolve(null));

    const { findByText, findByTestId } = renderWrapper();

    fireEvent.click(await findByTestId('edit-control-actions-toggle'));
    fireEvent.click(await findByText('ld.viewMarc'));

    expect(getMarcRecordMock).toHaveBeenCalled();
  });

  test('handles duplicate resource navigation', async () => {
    const { findByText, findByTestId } = renderWrapper();

    fireEvent.click(await findByTestId('edit-control-actions-toggle'));
    fireEvent.click(await findByText('ld.duplicate'));

    expect(navigateAsDuplicate).toHaveBeenCalled();
  });

  test("doesn't render actions dropdown in create mode", () => {
    const { queryByText } = renderWrapper(false);

    expect(queryByText('ld.actions')).not.toBeInTheDocument();
  });

  test('fetches RDF data', async () => {
    const getRdfRecordMock = jest
      .spyOn(recordsApi, 'getRdfRecord')
      .mockImplementation(() => Promise.resolve(new Response()));

    const { findByText, findByTestId } = renderWrapper();

    fireEvent.click(await findByTestId('edit-control-actions-toggle'));
    fireEvent.click(await findByText('ld.exportInstanceRdf'));

    expect(getRdfRecordMock).toHaveBeenCalled();
  });

  test('opens Profile Change modal for Work profile', async () => {
    const openModalForProfileChangeMock = jest.fn();
    jest.spyOn(useProfileSelectionHook, 'useProfileSelection').mockReturnValue({
      checkProfileAndProceed: jest.fn(),
      openModalForProfileChange: openModalForProfileChangeMock,
    });

    const workProfileState = [
      {
        store: useUIStore,
        state: { currentlyEditedEntityBfid: new Set([PROFILE_BFIDS.WORK]) },
      },
      {
        store: useInputsState,
        state: { selectedRecordBlocks: { block: 'test-work-block' } },
      },
    ];

    const { findByText, findByTestId } = renderWrapper(true, workProfileState);

    fireEvent.click(await findByTestId('edit-control-actions-toggle'));
    fireEvent.click(await findByText('ld.changeWorkProfile'));

    expect(openModalForProfileChangeMock).toHaveBeenCalledWith({ resourceTypeURL: 'test-work-block' });
  });

  test('opens Profile Change modal for Instance profile', async () => {
    const openModalForProfileChangeMock = jest.fn();
    jest.spyOn(useProfileSelectionHook, 'useProfileSelection').mockReturnValue({
      checkProfileAndProceed: jest.fn(),
      openModalForProfileChange: openModalForProfileChangeMock,
    });

    const { findByText, findByTestId } = renderWrapper();

    fireEvent.click(await findByTestId('edit-control-actions-toggle'));
    fireEvent.click(await findByText('ld.changeInstanceProfile'));

    expect(openModalForProfileChangeMock).toHaveBeenCalledWith({ resourceTypeURL: 'test-block' });
  });
});
