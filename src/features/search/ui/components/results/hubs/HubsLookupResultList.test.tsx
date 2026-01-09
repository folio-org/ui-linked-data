import { render, screen } from '@testing-library/react';
import { HubsLookupResultList } from './HubsLookupResultList';
import * as useFormattedResultsHook from '../../../hooks/useFormattedResults';
import * as useTableFormatterHook from '../../../hooks/useTableFormatter';

jest.mock('../../../hooks/useFormattedResults');
jest.mock('../../../hooks/useTableFormatter');
interface MockTableFlexProps {
  header: unknown;
  data: unknown;
  className?: string;
}

jest.mock('@/components/Table', () => ({
  TableFlex: ({ header, data, className }: MockTableFlexProps) => (
    <div data-testid="table-flex" className={className}>
      <div data-testid="table-header">{JSON.stringify(header)}</div>
      <div data-testid="table-data">{JSON.stringify(data)}</div>
    </div>
  ),
}));

const mockUseFormattedResults = useFormattedResultsHook.useFormattedResults as jest.Mock;
const mockUseTableFormatter = useTableFormatterHook.useTableFormatter as jest.Mock;

describe('HubsLookupResultList', () => {
  const mockData: SearchResultsTableRow[] = [
    {
      title: { label: 'Test Hub 1' },
      __meta: { id: '1', key: '1' },
    },
    {
      title: { label: 'Test Hub 2' },
      __meta: { id: '2', key: '2' },
    },
  ];

  const mockFormattedData = [
    {
      title: { label: 'Test Hub 1', children: <span>Test Hub 1</span> },
      __meta: { id: '1', key: '1' },
    },
  ];

  const mockListHeader = {
    title: { label: 'Title', position: 1 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TableFlex with formatted data', () => {
    mockUseFormattedResults.mockReturnValue(mockData);
    mockUseTableFormatter.mockReturnValue({
      formattedData: mockFormattedData,
      listHeader: mockListHeader,
    });

    render(<HubsLookupResultList />);

    expect(screen.getByTestId('table-flex')).toBeInTheDocument();
    expect(screen.getByTestId('table-flex')).toHaveClass('results-list');
  });

  test('renders with empty data when useFormattedResults returns undefined', () => {
    mockUseFormattedResults.mockReturnValue(undefined);
    mockUseTableFormatter.mockReturnValue({
      formattedData: [],
      listHeader: mockListHeader,
    });

    render(<HubsLookupResultList />);

    expect(mockUseTableFormatter).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [],
      }),
    );
  });

  test('passes correct context to useTableFormatter in search mode', () => {
    mockUseFormattedResults.mockReturnValue(mockData);
    mockUseTableFormatter.mockReturnValue({
      formattedData: mockFormattedData,
      listHeader: mockListHeader,
    });

    render(<HubsLookupResultList context="search" />);

    expect(mockUseTableFormatter).toHaveBeenCalledWith(
      expect.objectContaining({
        context: 'search',
      }),
    );
  });

  test('passes correct context to useTableFormatter in complexLookup mode', () => {
    mockUseFormattedResults.mockReturnValue(mockData);
    mockUseTableFormatter.mockReturnValue({
      formattedData: mockFormattedData,
      listHeader: mockListHeader,
    });

    const onAssign = jest.fn();
    render(<HubsLookupResultList context="complexLookup" onAssign={onAssign} />);

    expect(mockUseTableFormatter).toHaveBeenCalledWith(
      expect.objectContaining({
        context: 'complexLookup',
        onAssign,
      }),
    );
  });

  test('passes checkFailedId callback to useTableFormatter', () => {
    mockUseFormattedResults.mockReturnValue(mockData);
    mockUseTableFormatter.mockReturnValue({
      formattedData: mockFormattedData,
      listHeader: mockListHeader,
    });

    const checkFailedId = jest.fn();
    render(<HubsLookupResultList checkFailedId={checkFailedId} />);

    expect(mockUseTableFormatter).toHaveBeenCalledWith(
      expect.objectContaining({
        checkFailedId,
      }),
    );
  });

  test('uses default empty array when data is null', () => {
    mockUseFormattedResults.mockReturnValue(null);
    mockUseTableFormatter.mockReturnValue({
      formattedData: [],
      listHeader: mockListHeader,
    });

    render(<HubsLookupResultList />);

    expect(mockUseTableFormatter).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [],
      }),
    );
  });
});
