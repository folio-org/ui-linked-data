import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { FullDisplay } from '@components/FullDisplay';
import { Edit } from '@views';
import state from '@state';

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
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<FullDisplay />} />
            <Route path="/resources/:resourceId/edit" element={<Edit />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>,
    ),
  );

  const { getAllByTestId } = screen;

  test('removes a preview content entry on close button click', () => {
    fireEvent.click(getAllByTestId('preview-remove')[0]);

    expect(getAllByTestId('preview-remove')).toHaveLength(mockPreviewContent.length - 1);
  });

  test('navigate to Edit page on edit button click', async () => {
    fireEvent.click(getAllByTestId('preview-fetch')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-page')).toBeInTheDocument();
    });
  });
});
