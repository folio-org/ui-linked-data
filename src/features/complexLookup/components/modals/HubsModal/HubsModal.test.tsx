import { render, screen } from '@testing-library/react';
import { HubsModal } from './HubsModal';
import * as ComplexLookupHooks from '@/features/complexLookup/hooks';

jest.mock('@/features/complexLookup/hooks', () => ({
  useComplexLookupModalState: jest.fn(),
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

jest.mock('@/features/search/ui/components/Search', () => {
  const MockSearch = Object.assign(
    ({ children }: { children: React.ReactNode }) => <div data-testid="search">{children}</div>,
    {
      Controls: Object.assign(({ children }: { children: React.ReactNode }) => <div>{children}</div>, {
        InputsWrapper: () => <div />,
        SubmitButton: () => <div />,
        MetaControls: () => <div />,
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
  HubsResultList: ({
    context,
    onAssign,
  }: {
    context: string;
    onAssign: (record: ComplexLookupAssignRecordDTO) => void;
  }) => (
    <div data-testid="hubs-result-list">
      <span>{context}</span>
      <button onClick={() => onAssign({ id: 'hub-1', title: 'Hub 1' })}>Assign Hub</button>
    </div>
  ),
}));

describe('HubsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAssign = jest.fn();

  beforeEach(() => {
    (ComplexLookupHooks.useComplexLookupModalState as jest.Mock).mockReturnValue(undefined);
  });

  describe('Modal visibility', () => {
    it('renders modal when isOpen is true', () => {
      render(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('ld.hubs.assign');
    });

    it('does not render modal when isOpen is false', () => {
      render(<HubsModal isOpen={false} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Modal state management', () => {
    it('calls useComplexLookupModalState with correct parameters', () => {
      const initialQuery = 'Test Hub';

      render(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} initialQuery={initialQuery} />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        initialQuery: 'Test Hub',
        defaultSegment: 'hubs',
        defaultSource: 'external',
      });
    });

    it('calls useComplexLookupModalState without initialQuery when not provided', () => {
      render(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        initialQuery: undefined,
        defaultSegment: 'hubs',
        defaultSource: 'external',
      });
    });

    it('updates modal state when isOpen changes', () => {
      const { rerender } = render(<HubsModal isOpen={false} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );

      rerender(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: true }),
      );
    });
  });

  describe('Search integration', () => {
    it('renders search component with correct structure', () => {
      render(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('search')).toBeInTheDocument();
      expect(screen.getByTestId('complex-lookup-search-contents')).toBeInTheDocument();
    });

    it('renders HubsResultList with complexLookup context', () => {
      render(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const resultList = screen.getByTestId('hubs-result-list');
      expect(resultList).toBeInTheDocument();
      expect(resultList).toHaveTextContent('complexLookup');
    });

    it('passes onAssign to HubsResultList', () => {
      render(<HubsModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const assignButton = screen.getByText('Assign Hub');
      assignButton.click();

      expect(mockOnAssign).toHaveBeenCalledWith({ id: 'hub-1', title: 'Hub 1' });
    });
  });
});
