import { render, screen } from '@testing-library/react';
import { ResourcesResultList } from './ResourcesResultList';
import * as useFormattedResultsHook from '../../../hooks/useFormattedResults';

jest.mock('../../../hooks/useFormattedResults');
interface MockSearchResultEntryProps {
  id: string;
  title?: string;
}

jest.mock('./SearchResultEntry', () => ({
  SearchResultEntry: ({ id, title }: MockSearchResultEntryProps) => (
    <div data-testid={`result-entry-${id}`}>{title}</div>
  ),
}));

const mockUseFormattedResults = useFormattedResultsHook.useFormattedResults as jest.Mock;

describe('ResourcesResultList', () => {
  test('renders search result entries for each data item', () => {
    const mockData: WorkAsSearchResultDTO[] = [
      {
        id: '1',
        title: 'Test Work 1',
        author: 'Author 1',
      } as WorkAsSearchResultDTO,
      {
        id: '2',
        title: 'Test Work 2',
        author: 'Author 2',
      } as WorkAsSearchResultDTO,
    ];

    mockUseFormattedResults.mockReturnValue(mockData);

    render(<ResourcesResultList />);

    expect(screen.getByTestId('result-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('result-entry-2')).toBeInTheDocument();
  });

  test('renders nothing when data is undefined', () => {
    mockUseFormattedResults.mockReturnValue(undefined);

    const { container } = render(<ResourcesResultList />);

    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when data is empty array', () => {
    mockUseFormattedResults.mockReturnValue([]);

    const { container } = render(<ResourcesResultList />);

    expect(container.firstChild).toBeNull();
  });

  test('renders correct number of entries for multiple items', () => {
    const mockData: WorkAsSearchResultDTO[] = Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Test Work ${i + 1}`,
      author: `Author ${i + 1}`,
    })) as WorkAsSearchResultDTO[];

    mockUseFormattedResults.mockReturnValue(mockData);

    render(<ResourcesResultList />);

    mockData.forEach(item => {
      expect(screen.getByTestId(`result-entry-${item.id}`)).toBeInTheDocument();
    });
  });

  test('passes all props to SearchResultEntry', () => {
    const mockData: WorkAsSearchResultDTO[] = [
      {
        id: '123',
        title: 'Complex Work',
        author: 'Test Author',
        instances: [],
      } as WorkAsSearchResultDTO,
    ];

    mockUseFormattedResults.mockReturnValue(mockData);

    render(<ResourcesResultList />);

    expect(screen.getByTestId('result-entry-123')).toBeInTheDocument();
  });
});
