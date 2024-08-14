import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { FullDisplay } from '@components/FullDisplay';
import { Edit } from '@views';
import state from '@state';
import { Fragment, ReactNode } from 'react';

const mockPreviewContent = [
  {
    id: 'k1',
    base: new Map(),
    userValues: {
      mockUserValueKey: null,
    },
    initKey: 'key1',
    entities: ['lc:RT:bf2:Monograph:Work'],
  },
  {
    id: 'k2',
    base: new Map(),
    userValues: {},
    initKey: 'key2',
  },
];

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }: any) => {
    return (
      <div id={id}>
        {Object.entries(values ?? {})?.map(([k, v]) => (
          <Fragment key={k}>{v as ReactNode}</Fragment>
        ))}
      </div>
    );
  },
}));

describe('FullDisplay', () => {
  beforeEach(() =>
    render(
      <RecoilRoot
        initializeState={snapshot => snapshot.set(state.inputs.previewContent, mockPreviewContent as PreviewContent[])}
      >
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<FullDisplay />} />
            <Route path="/resources/:resourceId/edit" element={<Edit />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>,
    ),
  );

  const { getByTestId, getAllByTestId, getByText } = screen;

  test('contains preview container and header', () => {
    expect(getByTestId('preview-contents-container')).toBeInTheDocument();
    expect(getByText('Work')).toBeInTheDocument();
  });

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
