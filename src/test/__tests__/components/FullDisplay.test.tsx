import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Fragment, ReactNode } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { FullDisplay } from '@components/FullDisplay';
import { Edit } from '@views';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useInputsStore } from '@src/store';

const mockPreviewContent = [
  {
    id: 'k1',
    base: new Map(),
    userValues: {
      mockUserValueKey: null,
    },
    initKey: 'key1',
    entities: ['lde:Profile:Work'],
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
      <div id={id}>{Object.entries(values ?? {})?.map(([k, v]) => <Fragment key={k}>{v as ReactNode}</Fragment>)}</div>
    );
  },
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('FullDisplay', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: { previewContent: mockPreviewContent as PreviewContent[] },
      },
    ]);

    const routes = [
      {
        path: '/',
        element: <FullDisplay />,
      },
      {
        path: '/resources/:resourceId/edit',
        element: <Edit />,
      },
    ];

    return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />);
  });

  const { getByTestId, getAllByTestId } = screen;

  test('contains preview container and header', () => {
    expect(getByTestId('preview-contents-container')).toBeInTheDocument();
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
