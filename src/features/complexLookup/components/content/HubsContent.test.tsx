import { render, screen } from '@testing-library/react';

import { HubsContent } from './HubsContent';

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
  const mockHandleHubAssign = jest.fn();
  const mockHandleHubTitleClick = jest.fn();

  describe('Component structure', () => {
    it('renders control pane with hubs label', () => {
      render(<HubsContent />);

      const controlPane = screen.getByTestId('control-pane');
      expect(controlPane).toBeInTheDocument();
      expect(controlPane).toHaveTextContent('ld.hubs');
    });

    it('renders content container', () => {
      render(<HubsContent />);

      expect(screen.getByTestId('content-container')).toBeInTheDocument();
    });

    it('renders HubsLookupResultList with complexLookup context', () => {
      render(<HubsContent />);

      const resultList = screen.getByTestId('hubs-lookup-result-list');
      expect(resultList).toBeInTheDocument();
      expect(resultList).toHaveTextContent('complexLookup');
    });

    it('renders pagination component', () => {
      render(<HubsContent />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('Props integration', () => {
    it('passes handleHubAssign to HubsLookupResultList', () => {
      render(<HubsContent handleHubAssign={mockHandleHubAssign} />);

      screen.getByText('Assign Hub').click();

      expect(mockHandleHubAssign).toHaveBeenCalledWith({ id: 'hub_1', title: 'Hub 1' });
    });

    it('passes handleHubTitleClick to HubsLookupResultList', () => {
      render(<HubsContent handleHubTitleClick={mockHandleHubTitleClick} />);

      expect(screen.getByTestId('hubs-lookup-result-list')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('shows loading state when isAssigning is true', () => {
      render(<HubsContent isAssigning={true} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('hubs-lookup-result-list')).not.toBeInTheDocument();
    });

    it('shows result list when isAssigning is false', () => {
      render(<HubsContent isAssigning={false} />);

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('hubs-lookup-result-list')).toBeInTheDocument();
    });
  });
});
