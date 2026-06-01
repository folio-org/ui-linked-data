import { setInitialGlobalState } from '@/test/__mocks__/store';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import { ResourceType } from '@/common/constants/record.constants';
import * as recordHelper from '@/common/helpers/record.helper';

import { useEditPreview } from '@/features/edit/hooks/useEditPreview';

import { useInputsStore, useUIStore } from '@/store';

import { EditPreview } from './EditPreview';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

jest.mock('@/features/edit/hooks/useEditPreview', () => ({
  useEditPreview: jest.fn(),
}));

jest.mock('@/common/helpers/record.helper', () => ({
  ...jest.requireActual('@/common/helpers/record.helper'),
}));

jest.mock('@/common/hooks/useNavigateToCreatePage', () => ({
  useNavigateToCreatePage: () => ({ onCreateNewResource: jest.fn() }),
}));

jest.mock('@/features/preview/components/Preview/TitledPreview', () => ({
  TitledPreview: () => null,
}));

const mockUseEditPreview = useEditPreview as jest.Mock;

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('EditPreview', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

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

  test('shows instances list after navigating to a different resource when an instance was selected', async () => {
    jest.spyOn(recordHelper, 'getRecordDependencies').mockReturnValue({
      keys: { key: 'instanceKey', uri: 'http://bibfra.me/vocab/lite/Instance' },
      type: ResourceType.instance,
      entries: [{ id: 'instance-1' }, { id: 'instance-2' }],
    });

    setInitialGlobalState([
      { store: useInputsStore, state: { record: { resource: {} } } },
      { store: useUIStore, state: { currentlyPreviewedEntityBfid: new Set([PROFILE_BFIDS.INSTANCE]) } },
    ]);

    const router = createMemoryRouter([{ path: '/resources/:resourceId/edit', element: <EditPreview /> }], {
      initialEntries: ['/resources/work-1/edit?type=work'],
    });

    const { container } = render(<RouterProvider router={router} />);
    const view = within(container);

    // Instances list is shown initially (no instance selected)
    expect(view.getByTestId('instances-list')).toBeInTheDocument();

    // Click instance preview button -> selection set -> list replaced by TitledPreview
    fireEvent.click(view.getByTestId('preview-button__instance-1'));
    expect(view.queryByTestId('instances-list')).not.toBeInTheDocument();

    // Navigate to a different work resource
    await act(async () => {
      router.navigate('/resources/work-2/edit?type=work');
    });

    // After navigation, selection is reset -> instances list shown again
    expect(view.getByTestId('instances-list')).toBeInTheDocument();
  });
});
