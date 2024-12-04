import { Preview } from '@components/Preview';
import { useInputsStore, useProfileStore } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import state from '@state';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const initialSchemaKey = 'uuid0';

const userValues = {
  uuid1: {
    uuid: 'uuid1',
    contents: [
      {
        label: 'uuid1-label',
        meta: {
          uri: 'uuid1-uri',
        },
      },
    ],
  },
  uuid3: {
    uuid: 'uuid3',
    contents: [
      {
        label: 'uuid3-label',
      },
    ],
  },
};

const schema = new Map([
  ['uuid0', { displayName: 'uuid0', path: [], uuid: 'uuid0', children: ['uuid1', 'uuid2'] }],
  ['uuid1', { bfid: 'uuid1Bfid', displayName: 'uuid1', path: ['uuid0', 'uuid1'], uuid: 'uuid1' }],
  ['uuid2', { displayName: 'uuid2', path: ['uuid0', 'uuid2'], uuid: 'uuid2', type: 'simple', children: ['uuid3'] }],
  ['uuid3', { displayName: 'uuid3', path: ['uuid0', 'uuid2', 'uuid3'], uuid: 'uuid3' }],
]);

describe('Preview', () => {
  const { getAllByTestId, getByText } = screen;

  beforeEach(() => {
    setInitialGlobalState(useProfileStore, { initialSchemaKey, schema });
    setInitialGlobalState(useInputsStore, { userValues });

    return render(
      <RecoilRoot
        initializeState={snapshot => {
          snapshot.set(state.ui.currentlyPreviewedEntityBfid, new Set(['uuid1Bfid']));
        }}
      >
        <BrowserRouter>
          <Preview />
        </BrowserRouter>
      </RecoilRoot>,
    );
  });

  test('renders Preview component if a profile is selected', () => {
    expect(getAllByTestId('preview-fields')[0]).toBeInTheDocument();
  });

  test('renders Fields component recursively if an entry has children', () => {
    expect(getByText('uuid1')).toBeInTheDocument();
  });

  test('renders user values if an entry has no children', () => {
    expect(getByText('uuid1-label')).toBeInTheDocument();
  });
});
