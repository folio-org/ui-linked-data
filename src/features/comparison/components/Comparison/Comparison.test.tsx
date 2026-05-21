import { navigateToEditPage } from '@/test/__mocks__/common/hooks/useNavigateToEditPage.mock';
import { StoreWithState, setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

import { fireEvent, render } from '@testing-library/react';

import { useComparisonData } from '@/features/comparison/hooks';

import { useSearchStore, useUIStore } from '@/store';

import { Comparison } from './Comparison';

jest.mock('@/features/comparison/hooks', () => ({
  useComparisonData: jest.fn(),
}));

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

const mockUseComparisonData = useComparisonData as jest.Mock;

const makeItem = (id: string, title = 'mockTitle') => ({
  id,
  data: { title, schema: new Map(), userValues: {}, initKey: '', referenceIds: [], selectedEntries: [] },
  isLoading: false,
});

describe('Comparison', () => {
  const resetFullDisplayComponentType = jest.fn();
  const resetSelectedInstances = jest.fn();
  const setSelectedInstances = jest.fn();

  const baseMockState = [
    {
      store: useSearchStore,
      state: { selectedInstances: ['mockId'], setSelectedInstances },
    },
  ];

  const renderWithState = (stateArgs?: StoreWithState[], comparisonItems = [makeItem('mockId')]) => {
    mockUseComparisonData.mockReturnValue({ items: comparisonItems, isLoading: false });

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
    const { getByText } = renderWithState([], []);

    expect(getByText('ld.chooseTwoResourcesCompare')).toBeInTheDocument();
  });

  test('renders placeholder if previewContent has only one entry', () => {
    const { getByText } = renderWithState(baseMockState);

    expect(getByText('ld.chooseOneResourceCompare')).toBeInTheDocument();
  });

  test('removes an entry', () => {
    const { getByTestId } = renderWithState([
      {
        store: useSearchStore,
        state: { selectedInstances: ['mockId'], setSelectedInstances },
      },
      {
        store: useUIStore,
        state: { resetFullDisplayComponentType },
      },
    ]);

    fireEvent.click(getByTestId('remove-comparison-entry-mockId'));

    expect(setSelectedInstances).toHaveBeenCalled();
    expect(resetFullDisplayComponentType).toHaveBeenCalled();
  });

  test('updates current page when removing last item on last page', () => {
    const ids = ['mockId_1', 'mockId_2', 'mockId_3'];
    const { getByTestId } = renderWithState(
      [
        {
          store: useSearchStore,
          state: { selectedInstances: ids, setSelectedInstances },
        },
      ],
      ids.map(id => makeItem(id)),
    );

    fireEvent.click(getByTestId('forward-button'));
    fireEvent.click(getByTestId('remove-comparison-entry-mockId_3'));

    expect(setSelectedInstances).toHaveBeenCalled();
    expect(getByTestId('backward-button')).toBeInTheDocument();
  });

  test('closes comparison', async () => {
    const { getByTestId } = renderWithState([
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
    const ids = ['mockId_1', 'mockId_2', 'mockId_3'];
    const { getByTestId, getAllByText } = renderWithState(
      [
        {
          store: useSearchStore,
          state: { selectedInstances: ids },
        },
      ],
      ids.map(id => makeItem(id)),
    );

    fireEvent.click(getByTestId('forward-button'));

    expect(getAllByText(2)[0]).toBeInTheDocument();

    fireEvent.click(getByTestId('backward-button'));

    expect(getAllByText(1)[0]).toBeInTheDocument();
  });
});
