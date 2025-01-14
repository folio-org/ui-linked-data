import { navigateToEditPage } from '@src/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { fireEvent, render } from '@testing-library/react';
import { setInitialGlobalState, StoreWithState } from '@src/test/__mocks__/store';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Comparison } from '@components/Comparison';
import { ReactNode } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useInputsStore, useSearchStore, useUIStore } from '@src/store';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }: any) => {
    return (
      <div id={id}>
        {values ? Object.entries(values).map(([k, v]) => <Fragment key={k}>{v as ReactNode}</Fragment>) : id}
      </div>
    );
  },
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('Comparison', () => {
  const resetPreviewContent = jest.fn();
  const resetFullDisplayComponentType = jest.fn();
  const resetSelectedInstances = jest.fn();
  const setSelectedInstances = jest.fn();
  const setPreviewContent = jest.fn();

  const baseMockState = [
    {
      store: useInputsStore,
      state: { previewContent: [{ id: 'mockId', title: 'mockTitle' }], setPreviewContent },
    },
  ];

  const renderWithState = (stateArgs?: StoreWithState[]) => {
    if (stateArgs) {
      setInitialGlobalState(stateArgs);
    }

    return render(
      <RouterProvider
        router={createMemoryRouter([
          {
            path: '/',
            element: <Comparison />,
          },
        ])}
      />,
    );
  };

  test('renders placeholder if no previewContent present', () => {
    const { getByText } = renderWithState();

    expect(getByText('ld.chooseTwoResourcesCompare')).toBeInTheDocument();
  });

  test('renders placeholder if previewContent has only one entry', () => {
    const { getByText } = renderWithState(baseMockState);

    expect(getByText('ld.chooseOneResourceCompare')).toBeInTheDocument();
  });

  test('removes an entry', () => {
    const { getByTestId } = renderWithState([
      ...baseMockState,
      {
        store: useSearchStore,
        state: { setSelectedInstances },
      },
    ]);

    fireEvent.click(getByTestId('remove-comparison-entry'));

    expect(setPreviewContent).toHaveBeenCalled();
    expect(setSelectedInstances).toHaveBeenCalled();
  });

  test('closes comparison', async () => {
    const { getByTestId } = renderWithState([
      {
        store: useInputsStore,
        state: { resetPreviewContent },
      },
      {
        store: useUIStore,
        state: { resetFullDisplayComponentType },
      },
      {
        store: useSearchStore,
        state: { resetSelectedInstances },
      },
    ]);

    fireEvent.click(getByTestId('close-comparison-section'));

    expect(resetPreviewContent).toHaveBeenCalled();
    expect(resetFullDisplayComponentType).toHaveBeenCalled();
    expect(resetSelectedInstances).toHaveBeenCalled();
  });

  test('handles navigation to own page', async () => {
    const { getByTestId, getByText } = renderWithState(baseMockState);

    fireEvent.click(getByTestId('preview-actions-dropdown'));
    fireEvent.click(getByText('ld.edit'));

    expect(navigateToEditPage).toHaveBeenCalled();
  });

  test('navigates page-wise', async () => {
    const { getByTestId, getAllByText } = renderWithState([
      {
        store: useInputsStore,
        state: {
          previewContent: [
            { id: 'mockId_1', title: 'mockTitle 1' },
            { id: 'mockId_2', title: 'mockTitle 2' },
            { id: 'mockId_3', title: 'mockTitle 3' },
          ],
        },
      },
    ]);

    fireEvent.click(getByTestId('forward-button'));

    expect(getAllByText(2)[0]).toBeInTheDocument();

    fireEvent.click(getByTestId('backward-button'));

    expect(getAllByText(1)[0]).toBeInTheDocument();
  });
});
