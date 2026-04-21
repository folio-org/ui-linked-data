import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { Row } from '@/components/Table';

import * as useHubsTableFormatterModule from '@/features/search/ui/hooks/useHubsTableFormatter';

import { HubsResultList } from './HubsResultList';

// Mock dependencies
jest.mock('@/features/search/ui/hooks/useHubsTableFormatter');
jest.mock('@/components/Table', () => ({
  TableFlex: () => <div data-testid="table-flex">Table</div>,
}));

const mockNavigateWithState = jest.fn();

jest.mock('@/common/hooks/useNavigateWithSearchState', () => ({
  useNavigateWithSearchState: () => ({
    navigateWithState: mockNavigateWithState,
  }),
}));

jest.mock('@/common/helpers/navigation.helper', () => ({
  generateEditResourceUrl: (id: string) => `/resources/${id}/edit`,
}));

jest.mock('@/features/hubImport', () => ({
  generateHubImportPreviewUrl: (uri: string) => `/hub-import?sourceUri=${uri}`,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('HubsResultList', () => {
  const mockFormatterReturn = {
    formattedData: [],
    listHeader: {},
    isLoading: false,
  };

  const renderComponent = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HubsResultList />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  };

  test('renders table component', () => {
    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockFormatterReturn);

    renderComponent();

    expect(screen.getByTestId('hubs-search-result-list')).toBeInTheDocument();
    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
  });

  test('passes handleEdit and handleImport to formatter hook', () => {
    const formatterSpy = jest
      .spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter')
      .mockReturnValue(mockFormatterReturn);

    renderComponent();

    expect(formatterSpy).toHaveBeenCalledWith({
      onEdit: expect.any(Function),
      onImport: expect.any(Function),
      onTitleClick: expect.any(Function),
    });
  });

  test('handleEdit calls navigateWithState with correct URL', () => {
    let capturedOnEdit: ((id: string) => void) | undefined;

    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockImplementation(({ onEdit }) => {
      capturedOnEdit = onEdit;

      return mockFormatterReturn;
    });

    renderComponent();

    capturedOnEdit?.('hub_123');

    expect(mockNavigateWithState).toHaveBeenCalledWith('/resources/hub_123/edit');
  });

  test('handleImport calls navigateWithState with correct URL', () => {
    let capturedOnImport: ((uri: string) => void) | undefined;

    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockImplementation(({ onImport }) => {
      capturedOnImport = onImport;

      return mockFormatterReturn;
    });

    renderComponent();

    capturedOnImport?.('http://example.com/hub_456');

    expect(mockNavigateWithState).toHaveBeenCalledWith('/hub-import?sourceUri=http://example.com/hub_456');
  });

  test('applies correct CSS classes', () => {
    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockFormatterReturn);

    renderComponent();

    const container = screen.getByTestId('hubs-search-result-list');
    expect(container).toHaveClass('search-result-list');
    expect(container).toHaveClass('hubs-search-result-list');
  });

  test('renders formatted data from hook', () => {
    const mockDataWithItems: useHubsTableFormatterModule.UseHubsTableFormatterReturn = {
      formattedData: [] as Row[],
      listHeader: {} as Row,
    };

    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockDataWithItems);

    renderComponent();

    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
  });
});
