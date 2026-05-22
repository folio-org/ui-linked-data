import '@/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import '@/test/__mocks__/features/edit/hooks/useEditPage.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { Fragment, ReactNode } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Edit } from '@/views';
import { FullDisplay } from '@/views/Search/components/FullDisplay';

import { useResourcePreviewQuery } from '@/features/resources';

import { useInputsStore } from '@/store';

jest.mock('@/features/resources', () => ({
  ...jest.requireActual('@/features/resources'),
  useResourcePreviewQuery: jest.fn(),
}));

const mockUseResourcePreviewQuery = useResourcePreviewQuery as jest.Mock;

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }: never) => {
    return (
      <div id={id}>
        {Object.entries(values ?? {})?.map(([k, v]) => (
          <Fragment key={k}>{v as ReactNode}</Fragment>
        ))}
      </div>
    );
  },
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('FullDisplay', () => {
  beforeEach(() => {
    mockUseResourcePreviewQuery.mockImplementation((id: string) => ({
      data:
        id === 'k1'
          ? {
              schema: new Map(),
              userValues: { mockUserValueKey: null },
              initKey: 'key1',
              title: 'Title 1',
              entities: ['lde:Profile:Work'],
            }
          : {
              schema: new Map(),
              userValues: {},
              initKey: 'key2',
              title: 'Title 2',
              entities: [],
            },
    }));

    setInitialGlobalState([
      {
        store: useInputsStore,
        state: { activePreviewIds: ['k1', 'k2'] },
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

    expect(getAllByTestId('preview-remove')).toHaveLength(1);
  });

  test('navigate to Edit page on edit button click', async () => {
    fireEvent.click(getAllByTestId('preview-fetch')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-page')).toBeInTheDocument();
    });
  });
});
