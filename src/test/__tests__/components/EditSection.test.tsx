import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/hooks/useConfig.mock';
import * as RecordHelper from '@common/helpers/record.helper';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { routes } from '@src/App';
import state from '@state';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const userValues = {
  uuid3: {
    uuid: 'uuid3',
    contents: [
      {
        label: 'uuid3-uservalue-label',
      },
    ],
  },
  uuid4: {
    uuid: 'uuid4',
    contents: [
      {
        label: 'uuid4-uservalue-label',
      },
    ],
  },
  uuid5: {
    uuid: 'uuid5',
    contents: [
      {
        label: 'uuid5-uservalue-label',
      },
    ],
  },
  uuid6: {
    uuid: 'uuid6',
    contents: [
      {
        label: 'uuid6-uservalue-label',
      },
    ],
  },
  uuid7: {
    uuid: 'uuid7',
    contents: [
      {
        label: 'uuid7-uservalue-label',
      },
    ],
  },
};

const schema = new Map([
  [
    'uuid0',
    {
      bfid: 'uuid0Bfid',
      displayName: 'uuid0',
      type: AdvancedFieldType.block,
      path: ['uuid0'],
      uuid: 'uuid0',
      children: ['uuid1', 'uuid2'],
    },
  ],
  [
    'uuid1',
    {
      bfid: 'lc:RT:bf2:Monograph:Work',
      type: AdvancedFieldType.block,
      displayName: 'uuid1',
      path: ['uuid0', 'uuid1'],
      uuid: 'uuid1',
    },
  ],
  [
    'uuid2',
    {
      bfid: 'lc:RT:bf2:Monograph:Instance',
      displayName: 'uuid2',
      path: ['uuid0', 'uuid2'],
      uuid: 'uuid2',
      type: AdvancedFieldType.block,
      children: ['uuid3', 'uuid4', 'uuid5', 'uuid6', 'uuid7', 'uuid9', 'uuid10'],
    },
  ],
  [
    'uuid3',
    {
      bfid: 'uuid3Bfid',
      displayName: 'uuid3',
      type: AdvancedFieldType.simple,
      path: ['uuid0', 'uuid2', 'uuid3'],
      uuid: 'uuid3',
    },
  ],
  [
    'uuid4',
    {
      bfid: 'uuid4Bfid',
      displayName: 'uuid4',
      type: AdvancedFieldType.literal,
      path: ['uuid0', 'uuid2', 'uuid4'],
      uuid: 'uuid4',
    },
  ],
  [
    'uuid5',
    {
      bfid: 'uuid5Bfid',
      displayName: 'uuid5',
      type: AdvancedFieldType.complex,
      path: ['uuid0', 'uuid2', 'uuid5'],
      uuid: 'uuid5',
    },
  ],
  [
    'uuid6',
    {
      bfid: 'uuid6Bfid',
      displayName: 'uuid6',
      type: AdvancedFieldType.dropdown,
      path: ['uuid0', 'uuid2', 'uuid6'],
      uuid: 'uuid6',
      children: ['uuid7', 'uuid8'],
      constraints: { repeatable: true },
    },
  ],
  [
    'uuid7',
    {
      bfid: 'uuid7Bfid',
      uri: 'http://bibfra.me/vocab/lite/Person',
      displayName: 'uuid7',
      type: AdvancedFieldType.dropdownOption,
      path: ['uuid0', 'uuid2', 'uuid6', 'uuid7'],
      uuid: 'uuid7',
    },
  ],
  [
    'uuid8',
    {
      bfid: 'uuid8Bfid',
      displayName: 'uuid8',
      type: AdvancedFieldType.dropdownOption,
      path: ['uuid0', 'uuid2', 'uuid6', 'uuid8'],
      uuid: 'uuid8',
    },
  ],
  [
    'uuid9',
    {
      bfid: 'uuid9Bfid',
      displayName: 'uuid9',
      type: AdvancedFieldType.group,
      path: ['uuid0', 'uuid2', 'uuid9'],
      uuid: 'uuid9',
    },
  ],
]);

const monograph = {
  id: 'id',
  name: 'BIBFRAME 2.0 Monograph',
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

window.scrollTo = jest.fn();
jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('EditSection', () => {
  const renderScreen = () =>
    render(
      <RecoilRoot
        initializeState={snapshot => {
          snapshot.set(state.ui.currentlyEditedEntityBfid, new Set(['uuid2Bfid']));
          snapshot.set(state.config.schema, schema as Schema);
          snapshot.set(state.inputs.userValues, userValues);
          snapshot.set(state.config.initialSchemaKey, 'uuid0');
          snapshot.set(state.config.selectedProfile, monograph as unknown as ProfileEntry);
          snapshot.set(state.config.selectedEntries, ['uuid7']);
        }}
      >
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/resources/add-new'] })} />
      </RecoilRoot>,
    );

  test('renders literal; simple and complex lookup labels and values', async () => {
    const { findByText } = renderScreen();

    expect(await findByText('uuid3-uservalue-label')).toBeInTheDocument();
    expect(await findByText('uuid4')).toBeInTheDocument();
    expect(await findByText('uuid5')).toBeInTheDocument();
  });

  test('renders dropdown field', async () => {
    const { findByText } = renderScreen();

    expect(await findByText('marva.type')).toBeInTheDocument();
    expect(await findByText('uuid7')).toBeInTheDocument();
  });

  test('renders group component', async () => {
    const { findByText } = renderScreen();

    expect(await findByText('uuid9')).toBeInTheDocument();
  });

  test('calls onchange and sets values', async () => {
    const { getByTestId, findByDisplayValue } = renderScreen();

    fireEvent.change(getByTestId('literal-field'), { target: { value: 'sampleValue' } });

    await waitFor(async () => expect(await findByDisplayValue('sampleValue')).toBeInTheDocument());
  });

  test('saves record locally', () => {
    jest.useFakeTimers();

    const spyRecordHelper = jest.spyOn(RecordHelper, 'saveRecordLocally');

    const { getByTestId } = renderScreen();

    fireEvent.change(getByTestId('literal-field'), { target: { value: 'sampleValue' } });

    expect(spyRecordHelper).not.toHaveBeenCalled();

    jest.advanceTimersByTime(60 * 1000);

    expect(spyRecordHelper).toHaveBeenCalled();
  });

  describe('duplicate groups', () => {
    test('duplicates a field group', () => {
      const { getByTestId } = renderScreen();
      const parentElement = getByTestId('field-with-meta-controls-uuid6');

      fireEvent.click(within(parentElement).getByTestId('id-duplicate-group'));

      expect(getByTestId('duplicate-group-clone-amount')).toBeInTheDocument();
    });

    test('collapses the duplicated group', async () => {
      const { getByTestId, findAllByText } = renderScreen();
      const parentElement = getByTestId('field-with-meta-controls-uuid6');

      fireEvent.click(within(parentElement).getByTestId('id-duplicate-group'));

      fireEvent.click(getByTestId('duplicate-group-clone-amount'));

      expect(await findAllByText('uuid6')).toHaveLength(1);
    });

    test('collapses all duplicated groups', async () => {
      const { getByTestId, findAllByText } = renderScreen();
      const parentElement = getByTestId('field-with-meta-controls-uuid6');

      fireEvent.click(within(parentElement).getByTestId('id-duplicate-group'));

      fireEvent.click((await findAllByText('marva.collapseAll'))[0]);

      expect(await findAllByText('uuid6')).toHaveLength(1);
    });
  });
});
