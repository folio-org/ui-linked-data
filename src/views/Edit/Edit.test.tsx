import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';
import '@/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import {
  applyUpdatedSettingsToResource,
  initNewResource,
  loadResource,
} from '@/test/__mocks__/features/edit/hooks/useEditPage.mock';
import { clearRecordState } from '@/test/__mocks__/features/resources/hooks/useRecordNavigation.mock';
import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';

import * as Router from 'react-router-dom';

import { act, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import * as BibframeConstants from '@/common/constants/bibframe.constants';
import { Edit } from '@/views';

import { useProfileStore } from '@/store';

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
          state: {
            selectedProfile: recordState,
            selectedProfileSettingsId: null,
          },
        },
      ]);

      return render(
        <Router.BrowserRouter>
          <Edit />
        </Router.BrowserRouter>,
      );
    });

  test('renders EditSection component if a profile is selected and calls loadResource', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'testResourceId' });

    await renderComponent(monograph as unknown as ProfileEntry);

    expect(screen.getByTestId('edit-page')).toBeInTheDocument();
    expect(loadResource).toHaveBeenCalledWith('testResourceId', { asClone: false, ref: null }, expect.any(Function));
  });

  test("calls initNewResource and doesn't call loadResource when no resourceId", async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: undefined });

    await renderComponent(null);

    expect(initNewResource).toHaveBeenCalled();
    expect(loadResource).not.toHaveBeenCalled();
    expect(clearRecordState).not.toHaveBeenCalled();
  });

  test('calls loadResource with asClone when cloneOfParam search param is provided', async () => {
    const cloneOfParam = 'testCloneOfParam';
    const originalLocation = globalThis.location.href;
    globalThis.history.replaceState({}, '', `http://localhost/resources/create?cloneOf=${cloneOfParam}`);
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: undefined });

    await renderComponent(monograph as unknown as ProfileEntry);

    expect(loadResource).toHaveBeenCalledWith(cloneOfParam, { asClone: true, ref: null }, expect.any(Function));
    globalThis.history.replaceState({}, '', originalLocation);
  });

  test('skips initNewResource when resourceId or cloneOfParam exists', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'testId' });

    await renderComponent(null);

    expect(initNewResource).not.toHaveBeenCalled();
  });

  test('changing profile settings ID applies settings', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'testResourceId' });

    await renderComponent(null);

    setUpdatedGlobalState([
      {
        store: useProfileStore,
        updatedState: {
          selectedProfileSettingsId: 'changed',
        },
      },
    ]);

    await waitFor(() => {
      expect(applyUpdatedSettingsToResource).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'testResourceId' });

      const { container } = await renderComponent(monograph as unknown as ProfileEntry);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
