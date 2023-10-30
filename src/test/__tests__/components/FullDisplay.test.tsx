import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import { FullDisplay } from '@components/FullDisplay';
import state from '@state';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { fetchRecord } from '@src/test/__mocks__/common/hooks/useRecordControls.mock';

const mockPreviewContent = [
  {
    id: 'k1',
    base: new Map(),
    userValues: {},
    initKey: 'key1',
  },
  {
    id: 'k2',
    base: new Map(),
    userValues: {},
    initKey: 'key2',
  },
];

describe('FullDisplay', () => {
  beforeEach(() =>
    render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.inputs.previewContent, mockPreviewContent)}>
        <BrowserRouter>
          <FullDisplay />
        </BrowserRouter>
      </RecoilRoot>,
    ),
  );

  const { getAllByTestId } = screen;

  test('calls fetchRecord on edit button click', () => {
    fireEvent.click(getAllByTestId('preview-fetch')[0]);

    expect(fetchRecord).toHaveBeenCalled();
  });

  test('removes a preview content entry on close button click', () => {
    fireEvent.click(getAllByTestId('preview-remove')[0]);

    expect(getAllByTestId('preview-remove')).toHaveLength(mockPreviewContent.length - 1);
  });
});
