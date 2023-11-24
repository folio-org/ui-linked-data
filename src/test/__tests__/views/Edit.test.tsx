import '@src/test/__mocks__/common/hooks/useConfig.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { getProfiles } from '@src/test/__mocks__/common/hooks/useConfig.mock';
import { fetchRecord, clearRecordState } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { act, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import * as Router from 'react-router-dom';
import * as recordHelper from '@common/helpers/record.helper';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import { Edit } from '@views';
import state from '@state';

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

describe('Edit', () => {
  const testInstanceUri = 'testInstanceUri';
  const mockImportedConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  mockImportedConstant({ INSTANCE: testInstanceUri });
  const mockContents = {
    resource: { [testInstanceUri]: {} },
  };

  const renderComponent = (recordState: ProfileEntry | null) =>
    act(async () =>
      render(
        <RecoilRoot initializeState={snapshot => snapshot.set(state.config.selectedProfile, recordState)}>
          <Router.BrowserRouter>
            <Edit />
          </Router.BrowserRouter>
        </RecoilRoot>,
      ),
    );

  test('renders EditSection component if a profile is selected and calls fetchRecord', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: 'testResourceId' });

    await renderComponent(monograph as unknown as ProfileEntry);

    expect(screen.getByTestId('edit-page')).toBeInTheDocument();
    expect(fetchRecord).toHaveBeenCalled();
  });

  test("gets profiles with saved record and doesn't call fetchRecord", async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ resourceId: undefined });
    jest.spyOn(recordHelper, 'getSavedRecord').mockReturnValue({
      data: mockContents,
      createdAt: 100500,
    });
    const testRecord = {
      resource: { testInstanceUri: { id: 'testId' } },
    };
    jest.spyOn(recordHelper, 'getRecordWithUpdatedID').mockReturnValue(testRecord);

    await renderComponent(null);

    expect(getProfiles).toHaveBeenCalledWith({
      record: testRecord,
    });
    expect(fetchRecord).not.toHaveBeenCalled();
    expect(clearRecordState).toHaveBeenCalled();
  });
});
