import '@src/test/__mocks__/common/hooks/useConfig.mock';
import { getProfiles } from '@src/test/__mocks__/common/hooks/useConfig.mock';
import { fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { Edit } from '@views';
import state from '@state';
import { BrowserRouter } from 'react-router-dom';
import * as recordHelper from '@common/helpers/record.helper';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

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

describe('Edit', () => {
  const testInstanceUri = 'testInstanceUri';
  const mockImportedConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  mockImportedConstant({ INSTANCE: testInstanceUri });
  const mockContents = {
    resource: { [testInstanceUri]: {} },
  };

  const renderComponent = (recordState: ProfileEntry | null) =>
    render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.config.selectedProfile, recordState)}>
        <BrowserRouter>
          <Edit />
        </BrowserRouter>
      </RecoilRoot>,
    );

  test('renders EditSection component if a profile is selected', () => {
    renderComponent(monograph as unknown as ProfileEntry);

    expect(screen.getByTestId('edit-page')).toBeInTheDocument();
  });

  test("doesn't render EditSection component if no profile is selected", () => {
    renderComponent(null);

    expect(screen.queryByTestId('edit-page')).not.toBeInTheDocument();
  });

  describe('on click start from scratch', () => {
    beforeEach(() => {
      renderComponent(null);
    });

    test('gets profiles without saved record', async () => {
      fireEvent.click(screen.getByTestId('start-from-scratch'));

      expect(getProfiles).toHaveBeenCalledWith({ record: null });
    });

    test('gets profiles with saved record', async () => {
      jest.spyOn(recordHelper, 'getSavedRecord').mockReturnValue({
        data: mockContents,
        createdAt: 100500,
      });
      const testRecord = {
        resource: { testInstanceUri: { id: 'testId' } },
      };
      jest.spyOn(recordHelper, 'getRecordWithUpdatedID').mockReturnValue(testRecord);

      fireEvent.click(screen.getByTestId('start-from-scratch'));

      expect(getProfiles).toHaveBeenCalledWith({
        record: testRecord,
      });
    });
  });
});
