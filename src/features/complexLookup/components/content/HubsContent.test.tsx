import { render, screen } from '@testing-library/react';

import * as ComplexLookupHooks from '@/features/complexLookup/hooks';

import { HubsContent } from './HubsContent';

jest.mock('@/features/complexLookup/hooks', () => ({
  useHubsModalLogic: jest.fn(),
}));

jest.mock('@/components/Loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('@/features/search/ui/components/Search', () => {
  const MockSearch = Object.assign(
    ({ children }: { children: React.ReactNode }) => <div data-testid="search">{children}</div>,
    {
      ControlPane: ({ label }: { label: React.ReactNode }) => <div data-testid="control-pane">{label}</div>,
      ContentContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="content-container">{children}</div>
      ),
      Results: Object.assign(({ children }: { children: React.ReactNode }) => <div>{children}</div>, {
        Pagination: () => <div data-testid="pagination" />,
      }),
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
      <button onClick={() => onAssign({ id: 'hub_1', title: 'Hub 1' })}>Assign Hub</button>
    </div>
  ),
}));

describe('HubsContent', () => {
  const mockOnAssign = jest.fn();
  const mockOnClose = jest.fn();
  const mockHandleHubAssign = jest.fn();

  beforeEach(() => {
    (ComplexLookupHooks.useHubsModalLogic as jest.Mock).mockReturnValue({
      handleHubAssign: mockHandleHubAssign,
      isAssigning: false,
    });
  });

  describe('Component structure', () => {
    it('renders control pane with hubs label', () => {
      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      const controlPane = screen.getByTestId('control-pane');
      expect(controlPane).toBeInTheDocument();
      expect(controlPane).toHaveTextContent('ld.hubs');
    });

    it('renders content container', () => {
      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      expect(screen.getByTestId('content-container')).toBeInTheDocument();
    });

    it('renders HubsLookupResultList with complexLookup context', () => {
      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      const resultList = screen.getByTestId('hubs-lookup-result-list');
      expect(resultList).toBeInTheDocument();
      expect(resultList).toHaveTextContent('complexLookup');
    });

    it('renders pagination component', () => {
      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('Hook integration', () => {
    it('calls useHubsModalLogic with onAssign and onClose', () => {
      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      expect(ComplexLookupHooks.useHubsModalLogic).toHaveBeenCalledWith({
        onAssign: mockOnAssign,
        onClose: mockOnClose,
      });
    });

    it('passes handleHubAssign to HubsLookupResultList', () => {
      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      screen.getByText('Assign Hub').click();

      expect(mockHandleHubAssign).toHaveBeenCalledWith({ id: 'hub_1', title: 'Hub 1' });
      expect(mockOnAssign).not.toHaveBeenCalled();
    });
  });

  describe('Loading state', () => {
    it('shows loading state when isAssigning is true', () => {
      (ComplexLookupHooks.useHubsModalLogic as jest.Mock).mockReturnValue({
        handleHubAssign: mockHandleHubAssign,
        isAssigning: true,
      });

      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('hubs-lookup-result-list')).not.toBeInTheDocument();
    });

    it('shows result list when isAssigning is false', () => {
      (ComplexLookupHooks.useHubsModalLogic as jest.Mock).mockReturnValue({
        handleHubAssign: mockHandleHubAssign,
        isAssigning: false,
      });

      render(<HubsContent onAssign={mockOnAssign} onClose={mockOnClose} />);

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('hubs-lookup-result-list')).toBeInTheDocument();
    });
  });
});
