import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import * as ComplexLookupHooks from '@/features/complexLookup/hooks';
import * as useHubAssignmentModule from '@/features/complexLookup/hooks/useHubAssignment';

import { HubsModal } from './HubsModal';

jest.mock('@/features/complexLookup/hooks', () => ({
  useComplexLookupModalState: jest.fn(),
}));

jest.mock('@/features/complexLookup/hooks/useHubAssignment', () => ({
  useHubAssignment: jest.fn(),
}));

jest.mock('@/components/Modal', () => ({
  Modal: ({
    isOpen,
    children,
    title,
    onClose,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    title: React.ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

jest.mock('@/components/Loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('@/features/search/ui/components/Search', () => {
  const MockSearch = Object.assign(
    ({ children }: { children: React.ReactNode }) => <div data-testid="search">{children}</div>,
    {
      Controls: Object.assign(({ children }: { children: React.ReactNode }) => <div>{children}</div>, {
        InputsWrapper: () => <div />,
        SubmitButton: () => <div />,
        MetaControls: () => <div />,
        SourceSelector: () => <div />,
      }),
      Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      ContentContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Results: Object.assign(({ children }: { children: React.ReactNode }) => <div>{children}</div>, {
        Pagination: () => <div />,
      }),
      ControlPane: () => <div />,
    },
  );

  return { Search: MockSearch };
});

jest.mock('@/features/search/ui', () => ({
  HubsLookupResultList: ({
    context,
    onAssign,
  }: {
    context: string;
    onAssign: (record: ComplexLookupAssignRecordDTO) => void;
  }) => (
    <div data-testid="hubs-lookup-result-list">
      <span>{context}</span>
      <button onClick={() => onAssign({ id: 'hub-1', title: 'Hub 1' })}>Assign Hub</button>
    </div>
  ),
  SOURCE_OPTIONS: [],
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe('HubsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAssign = jest.fn();
  const mockHandleAssign = jest.fn();

  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
    (ComplexLookupHooks.useComplexLookupModalState as jest.Mock).mockReturnValue(undefined);
    (useHubAssignmentModule.useHubAssignment as jest.Mock).mockReturnValue({
      handleAssign: mockHandleAssign,
      isAssigning: false,
    });
  });

  describe('Modal visibility', () => {
    it('renders modal when isOpen is true', () => {
      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('ld.hubs.assign');
    });

    it('does not render modal when isOpen is false', () => {
      renderWithProviders(<HubsModal isOpen={false} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Modal state management', () => {
    it('calls useComplexLookupModalState with correct parameters', () => {
      const initialQuery = 'Test Hub';

      renderWithProviders(
        <HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} initialQuery={initialQuery} />,
      );

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        initialQuery: 'Test Hub',
        defaultSegment: 'hubsLookup',
        defaultSource: 'libraryOfCongress',
      });
    });

    it('calls useComplexLookupModalState without initialQuery when not provided', () => {
      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        initialQuery: undefined,
        defaultSegment: 'hubsLookup',
        defaultSource: 'libraryOfCongress',
      });
    });

    it('updates modal state when isOpen changes', () => {
      const { rerender } = renderWithProviders(
        <HubsModal isOpen={false} onClose={mockOnClose} onAssign={mockOnAssign} />,
      );

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );

      rerender(
        <QueryClientProvider client={queryClient}>
          <HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />
        </QueryClientProvider>,
      );

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: true }),
      );
    });
  });

  describe('Search integration', () => {
    it('renders search component with correct structure', () => {
      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('search')).toBeInTheDocument();
      expect(screen.getByTestId('complex-lookup-search-contents')).toBeInTheDocument();
    });

    it('renders HubsLookupResultList with complexLookup context', () => {
      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const resultList = screen.getByTestId('hubs-lookup-result-list');
      expect(resultList).toBeInTheDocument();
      expect(resultList).toHaveTextContent('complexLookup');
    });

    it('passes handleAssign from useHubAssignment to HubsLookupResultList', () => {
      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const assignButton = screen.getByText('Assign Hub');
      assignButton.click();

      expect(mockHandleAssign).toHaveBeenCalledWith({ id: 'hub-1', title: 'Hub 1' });
      expect(mockOnAssign).not.toHaveBeenCalled();
    });
  });

  describe('Hub assignment flow', () => {
    it('shows loading state when isAssigning is true', () => {
      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockReturnValue({
        handleAssign: mockHandleAssign,
        isAssigning: true,
      });

      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('hubs-lookup-result-list')).not.toBeInTheDocument();
    });

    it('hides loading state when isAssigning is false', () => {
      (useHubAssignmentModule.useHubAssignment as jest.Mock).mockReturnValue({
        handleAssign: mockHandleAssign,
        isAssigning: false,
      });

      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('hubs-lookup-result-list')).toBeInTheDocument();
    });

    it('initializes useHubAssignment with onAssignSuccess callback', () => {
      renderWithProviders(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(useHubAssignmentModule.useHubAssignment).toHaveBeenCalledWith({
        onAssignSuccess: expect.any(Function),
      });
    });
  });
});
