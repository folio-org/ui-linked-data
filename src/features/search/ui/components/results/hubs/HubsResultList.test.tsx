import { render, screen } from '@testing-library/react';

import { Row } from '@/components/Table';

import * as useHubsTableFormatterModule from '@/features/search/ui/hooks/useHubsTableFormatter';

import { HubsResultList } from './HubsResultList';

// Mock dependencies
jest.mock('@/features/search/ui/hooks/useHubsTableFormatter');
jest.mock('@/components/Table', () => ({
  TableFlex: () => <div data-testid="table-flex">Table</div>,
}));

const mockNavigateToEditPage = jest.fn();
const mockGenerateEditResourceUrl = jest.fn();

jest.mock('@/common/hooks/useNavigateToEditPage', () => ({
  useNavigateToEditPage: () => ({
    navigateToEditPage: mockNavigateToEditPage,
  }),
}));

jest.mock('@/common/helpers/navigation.helper', () => ({
  generateEditResourceUrl: (id: string) => mockGenerateEditResourceUrl(id),
}));

describe('HubsResultList', () => {
  beforeEach(() => {
    mockGenerateEditResourceUrl.mockImplementation((id: string) => `/resources/${id}/edit`);
  });

  const mockFormatterReturn = {
    formattedData: [],
    listHeader: {},
    isLoading: false,
  };

  test('renders table component', () => {
    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockFormatterReturn);

    render(<HubsResultList />);

    expect(screen.getByTestId('hubs-search-result-list')).toBeInTheDocument();
    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
  });

  test('passes handleEdit and handleImport to formatter hook', () => {
    const formatterSpy = jest
      .spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter')
      .mockReturnValue(mockFormatterReturn);

    render(<HubsResultList />);

    expect(formatterSpy).toHaveBeenCalledWith({
      onEdit: expect.any(Function),
      onImport: expect.any(Function),
    });
  });

  test('handleEdit navigates to edit page with correct URL', () => {
    let capturedOnEdit: ((id: string) => void) | undefined;

    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockImplementation(({ onEdit }) => {
      capturedOnEdit = onEdit;

      return mockFormatterReturn;
    });

    render(<HubsResultList />);

    capturedOnEdit?.('hub-123');

    expect(mockGenerateEditResourceUrl).toHaveBeenCalledWith('hub-123');
    expect(mockNavigateToEditPage).toHaveBeenCalledWith('/resources/hub-123/edit');
  });

  test('applies correct CSS classes', () => {
    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockFormatterReturn);

    render(<HubsResultList />);

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

    render(<HubsResultList />);

    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
  });
});
