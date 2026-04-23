import { navigateAsDuplicate } from '@/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import * as Router from 'react-router-dom';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { fireEvent, render } from '@testing-library/react';

import * as recordsApi from '@/common/api/records.api';
import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { ROUTES } from '@/common/constants/routes.constants';
import * as useProfileSelectionHook from '@/common/hooks/useProfileSelection';
import { BlockActions } from '@/components/EditSection/BlockActions';

import { useInputsState } from '@/store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const instanceEntry = {
  bfid: PROFILE_BFIDS.INSTANCE,
  uuid: 'uuid_instance',
  displayName: 'Instance',
  path: ['uuid_instance'],
} as SchemaEntry;

const workEntry = {
  bfid: PROFILE_BFIDS.WORK,
  uuid: 'uuid_work',
  displayName: 'Work',
  path: ['uuid_work'],
} as SchemaEntry;

const renderBlockActions = (entry: SchemaEntry, record?: Record<string, unknown>) => {
  setInitialGlobalState([
    {
      store: useInputsState,
      state: { selectedRecordBlocks: { block: 'test-block' }, record: record ?? null },
    },
  ]);

  jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'resource_1' });

  return render(
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path: ROUTES.RESOURCE_EDIT.uri,
            element: <BlockActions entry={entry} />,
          },
        ],
        { initialEntries: [ROUTES.RESOURCE_EDIT.uri] },
      )}
    />,
  );
};

describe('BlockActions', () => {
  test('renders actions dropdown for Instance entry', async () => {
    const { findByTestId } = renderBlockActions(instanceEntry);

    expect(await findByTestId('block-actions-toggle')).toBeInTheDocument();
  });

  test('does not render in create mode', () => {
    setInitialGlobalState([
      {
        store: useInputsState,
        state: { selectedRecordBlocks: { block: 'test-block' } },
      },
    ]);

    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'resource_1' });

    const { queryByTestId } = render(
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              path: ROUTES.RESOURCE_CREATE.uri,
              element: <BlockActions entry={instanceEntry} />,
            },
          ],
          { initialEntries: [ROUTES.RESOURCE_CREATE.uri] },
        )}
      />,
    );

    expect(queryByTestId('block-actions-toggle')).not.toBeInTheDocument();
  });

  test('fetches MARC data for Instance entry', async () => {
    const getMarcRecordMock = jest
      .spyOn(recordsApi, 'getMarcRecord')
      .mockImplementation(() => Promise.resolve({} as MarcDTO));

    const { findByText, findByTestId } = renderBlockActions(instanceEntry);

    fireEvent.click(await findByTestId('block-actions-toggle'));
    fireEvent.click(await findByText('ld.viewMarc'));

    expect(getMarcRecordMock).toHaveBeenCalled();
  });

  test('handles duplicate navigation', async () => {
    const { findByText, findByTestId } = renderBlockActions(instanceEntry);

    fireEvent.click(await findByTestId('block-actions-toggle'));
    fireEvent.click(await findByText('ld.duplicate'));

    expect(navigateAsDuplicate).toHaveBeenCalled();
  });

  test('fetches RDF data for Instance entry', async () => {
    const getRdfRecordMock = jest
      .spyOn(recordsApi, 'getRdfRecord')
      .mockImplementation(() => Promise.resolve(new Response()));

    const { findByText, findByTestId } = renderBlockActions(instanceEntry);

    fireEvent.click(await findByTestId('block-actions-toggle'));
    fireEvent.click(await findByText('ld.exportInstanceRdf'));

    expect(getRdfRecordMock).toHaveBeenCalled();
  });

  test('opens profile change modal for Work entry', async () => {
    const openModalForProfileChangeMock = jest.fn();
    jest.spyOn(useProfileSelectionHook, 'useProfileSelection').mockReturnValue({
      checkProfileAndProceed: jest.fn(),
      openModalForProfileChange: openModalForProfileChangeMock,
    });

    const { findByText, findByTestId } = renderBlockActions(workEntry);

    fireEvent.click(await findByTestId('block-actions-toggle'));
    fireEvent.click(await findByText('ld.changeWorkProfile'));

    expect(openModalForProfileChangeMock).toHaveBeenCalledWith({ resourceTypeURL: 'test-block' });
  });

  test('opens profile change modal for Instance entry', async () => {
    const openModalForProfileChangeMock = jest.fn();
    jest.spyOn(useProfileSelectionHook, 'useProfileSelection').mockReturnValue({
      checkProfileAndProceed: jest.fn(),
      openModalForProfileChange: openModalForProfileChangeMock,
    });

    const { findByText, findByTestId } = renderBlockActions(instanceEntry);

    fireEvent.click(await findByTestId('block-actions-toggle'));
    fireEvent.click(await findByText('ld.changeInstanceProfile'));

    expect(openModalForProfileChangeMock).toHaveBeenCalledWith({ resourceTypeURL: 'test-block' });
  });

  test('enables inventory view button when inventoryId is available', async () => {
    const record = {
      resource: {
        [BFLITE_URIS.INSTANCE]: {
          id: 'resource_1',
          folioMetadata: { inventoryId: 'inventory_1' },
        },
      },
    };

    const { findByText, findByTestId } = renderBlockActions(instanceEntry, record);

    fireEvent.click(await findByTestId('block-actions-toggle'));

    const button = await findByText('ld.inventoryView');
    expect(button.closest('button')).not.toBeDisabled();
  });

  test('disables inventory view button when inventoryId is not available', async () => {
    const { findByText, findByTestId } = renderBlockActions(instanceEntry);

    fireEvent.click(await findByTestId('block-actions-toggle'));

    const button = await findByText('ld.inventoryView');
    expect(button.closest('button')).toBeDisabled();
  });
});
