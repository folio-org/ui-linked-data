import { render, screen } from '@testing-library/react';
import { HubsResultList } from './HubsResultList';
import * as useHubsTableFormatterModule from '../../../hooks/useHubsTableFormatter';
import { Row } from '@/components/Table';

// Mock dependencies
jest.mock('../../../hooks/useHubsTableFormatter');
jest.mock('@/components/Table', () => ({
  TableFlex: () => <div data-testid="table-flex">Table</div>,
}));

describe('HubsResultList', () => {
  const mockOnEdit = jest.fn();
  const mockOnImport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFormatterReturn = {
    formattedData: [],
    listHeader: {},
    isLoading: false,
  };

  test('renders table component', () => {
    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockFormatterReturn);

    render(<HubsResultList onEdit={mockOnEdit} onImport={mockOnImport} />);

    expect(screen.getByTestId('hubs-search-result-list')).toBeInTheDocument();
    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
  });

  test('passes onEdit and onImport to formatter hook', () => {
    const formatterSpy = jest
      .spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter')
      .mockReturnValue(mockFormatterReturn);

    render(<HubsResultList onEdit={mockOnEdit} onImport={mockOnImport} />);

    expect(formatterSpy).toHaveBeenCalledWith({
      onEdit: mockOnEdit,
      onImport: mockOnImport,
    });
  });

  test('handles undefined callbacks gracefully', () => {
    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockFormatterReturn);

    const { container } = render(<HubsResultList />);

    expect(container.querySelector('.hubs-search-result-list')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    jest.spyOn(useHubsTableFormatterModule, 'useHubsTableFormatter').mockReturnValue(mockFormatterReturn);

    render(<HubsResultList onEdit={mockOnEdit} onImport={mockOnImport} />);

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

    render(<HubsResultList onEdit={mockOnEdit} onImport={mockOnImport} />);

    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
  });
});
