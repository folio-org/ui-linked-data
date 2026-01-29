import * as Router from 'react-router-dom';

import { act, render, screen } from '@testing-library/react';

import * as BibframeConstants from '@/common/constants/bibframe.constants';
import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import * as NavigationHelper from '@/common/helpers/navigation.helper';
import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';
import '@/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { getProfiles } from '@/test/__mocks__/common/hooks/useConfig.mock';
import { clearRecordState, fetchRecord } from '@/test/__mocks__/common/hooks/useRecordControls.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { Edit } from '@/views';

import { useUIStore } from '@/store';
import { useProfileStore } from '@/store/stores/profile';

const monograph = {
  id: 'id',
  name: 'name',
  configType: 'profile',
  json: {
    Profile: {
      resourceTemplates: [],
      author: 'author',
      date: 'date',
      description: 'description',
      id: 'id',
      title: 'title',
    },
  },
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useBlocker: () => ({
    state: 'unblocked',
    reset: undefined,
    proceed: undefined,
    location: undefined,
  }),
}));

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('Edit', () => {
  const testInstanceUri = 'testInstanceUri';
  const mockImportedConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  mockImportedConstant({ INSTANCE: testInstanceUri });

  const renderComponent = (recordState: ProfileEntry | null) =>
    act(async () => {
      setInitialGlobalState([
        {
          store: useProfileStore,
          state: { selectedProfile: recordState },
        },
      ]);

      return render(
        <Router.BrowserRouter>
          <Edit />
        </Router.BrowserRouter>,
      );
    });

  test('renders EditSection component if a profile is selected and calls fetchRecord', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'testResourceId' });
    jest.spyOn(NavigationHelper, 'getResourceIdFromUri').mockReturnValue('testResourceId');

    await renderComponent(monograph as unknown as ProfileEntry);

    expect(screen.getByTestId('edit-page')).toBeInTheDocument();
    expect(fetchRecord).toHaveBeenCalled();
  });

  test("gets profiles and doesn't call fetchRecord", async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: undefined });
    jest.spyOn(NavigationHelper, 'getResourceIdFromUri').mockReturnValue(undefined);

    await renderComponent(null);

    expect(getProfiles).toHaveBeenCalled();
    expect(fetchRecord).not.toHaveBeenCalled();
    expect(clearRecordState).not.toHaveBeenCalled();
  });

  test('calls fetchRecord with correct parameters when cloneOfParam search param is provided', async () => {
    const cloneOfParam = 'testCloneOfParam';
    const originalLocation = globalThis.location.href;
    globalThis.history.replaceState({}, '', `http://localhost/resources/create?cloneOf=${cloneOfParam}`);
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: undefined });

    await renderComponent(monograph as unknown as ProfileEntry);

    expect(fetchRecord).toHaveBeenCalledWith(cloneOfParam);
    globalThis.history.replaceState({}, '', originalLocation);
  });

  describe('setEntitesBFIds function', () => {
    const originalLocation = globalThis.location.href;

    beforeEach(() => {
      globalThis.history.replaceState({}, '', 'http://localhost/resources/create');
    });

    afterEach(() => {
      globalThis.history.replaceState({}, '', originalLocation);
    });

    test('sets instance as edited and work as previewed entity by default', async () => {
      const uiState = useUIStore.getState();
      const spySetCurrentlyEditedEntityBfid = jest.spyOn(uiState, 'setCurrentlyEditedEntityBfid');
      const spySetCurrentlyPreviewedEntityBfid = jest.spyOn(uiState, 'setCurrentlyPreviewedEntityBfid');
      jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: undefined });
      jest.spyOn(NavigationHelper, 'getResourceIdFromUri').mockReturnValue(undefined);

      await renderComponent(null);

      expect(spySetCurrentlyEditedEntityBfid).toHaveBeenCalledWith(new Set([PROFILE_BFIDS.INSTANCE]));
      expect(spySetCurrentlyPreviewedEntityBfid).toHaveBeenCalledWith(new Set([PROFILE_BFIDS.WORK]));
    });

    test('sets work as edited and instance as previewed entity when type=work', async () => {
      globalThis.history.replaceState({}, '', 'http://localhost/resources/create?type=work');

      const uiState = useUIStore.getState();
      const spySetCurrentlyEditedEntityBfid = jest.spyOn(uiState, 'setCurrentlyEditedEntityBfid');
      const spySetCurrentlyPreviewedEntityBfid = jest.spyOn(uiState, 'setCurrentlyPreviewedEntityBfid');
      jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: undefined });
      jest.spyOn(NavigationHelper, 'getResourceIdFromUri').mockReturnValue(undefined);

      await renderComponent(null);

      expect(spySetCurrentlyEditedEntityBfid).toHaveBeenCalledWith(new Set([PROFILE_BFIDS.WORK]));
      expect(spySetCurrentlyPreviewedEntityBfid).toHaveBeenCalledWith(new Set([PROFILE_BFIDS.INSTANCE]));
    });
  });

  test('skips profile fetching when resourceId or cloneOfParam exists', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'testId' });
    jest.spyOn(NavigationHelper, 'getResourceIdFromUri').mockReturnValue('testId');

    await renderComponent(null);

    expect(getProfiles).not.toHaveBeenCalled();
  });
});
