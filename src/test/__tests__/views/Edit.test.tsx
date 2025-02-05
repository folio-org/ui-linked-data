import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { getProfiles } from '@src/test/__mocks__/common/hooks/useConfig.mock';
import { fetchRecord, clearRecordState } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { act, render, screen } from '@testing-library/react';
import * as Router from 'react-router-dom';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import * as NavigationHelper from '@common/helpers/navigation.helper';
import { Edit } from '@views';
import { useProfileStore } from '@src/store/stores/profile';
import { setInitialGlobalState } from '@src/test/__mocks__/store';

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

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

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

    expect(getProfiles).toHaveBeenCalledWith({
      record: null,
    });
    expect(fetchRecord).not.toHaveBeenCalled();
    expect(clearRecordState).toHaveBeenCalled();
  });
});
