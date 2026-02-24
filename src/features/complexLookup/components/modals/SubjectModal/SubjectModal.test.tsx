import { render, screen } from '@testing-library/react';

import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';
import * as ComplexLookupHooks from '@/features/complexLookup/hooks';

import { SubjectModal } from './SubjectModal';

jest.mock('@/features/complexLookup/hooks', () => ({
  useComplexLookupModalState: jest.fn(),
  useAuthoritiesModalLogic: jest.fn(),
  useComplexLookupModalCleanup: jest.fn(),
  useHubsLookupModalLogic: jest.fn(),
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
        SegmentGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Segment: () => <div />,
        InputsWrapper: () => <div />,
        SubmitButton: () => <div />,
        MetaControls: () => <div />,
        SourceSelector: () => <div />,
        SegmentContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      }),
      Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
  );

  return { Search: MockSearch };
});

jest.mock('@/features/complexLookup/components/content', () => ({
  AuthoritiesContent: ({
    isMarcPreviewOpen,
    isMarcLoading,
    handleAuthoritiesAssign,
    handleTitleClick,
    handleCloseMarcPreview,
    checkFailedId,
    hasComplexFlow,
  }: {
    isMarcPreviewOpen: boolean;
    isMarcLoading: boolean;
    handleAuthoritiesAssign: (record: ComplexLookupAssignRecordDTO) => void;
    handleTitleClick: (id: string) => void;
    handleCloseMarcPreview: () => void;
    checkFailedId?: (id?: string) => boolean;
    hasComplexFlow?: boolean;
  }) => (
    <div data-testid="authorities-content">
      <span data-testid="marc-preview-open">{String(isMarcPreviewOpen)}</span>
      <span data-testid="marc-loading">{String(isMarcLoading)}</span>
      <span data-testid="has-complex-flow">{String(hasComplexFlow)}</span>
      <button onClick={() => handleAuthoritiesAssign({ id: 'auth_1', title: 'Authority 1' })}>Assign Authority</button>
      <button onClick={() => handleTitleClick('auth_1')}>View MARC</button>
      <button onClick={handleCloseMarcPreview}>Close MARC</button>
      {checkFailedId && <span data-testid="auth-has-check-failed-id">has checkFailedId</span>}
    </div>
  ),
  HubsContent: ({
    handleHubAssign,
    handleCloseHubPreview,
  }: {
    handleHubAssign?: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
    handleCloseHubPreview?: VoidFunction;
  }) => (
    <div data-testid="hubs-content">
      {handleHubAssign && <button onClick={() => handleHubAssign({ id: 'hub_1', title: 'Hub 1' })}>Assign Hub</button>}
      {handleCloseHubPreview && <button onClick={handleCloseHubPreview}>Close</button>}
    </div>
  ),
}));

describe('SubjectModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAssign = jest.fn();
  const mockHandleTitleClick = jest.fn();
  const mockHandleAuthoritiesAssign = jest.fn();
  const mockHandleCloseMarcPreview = jest.fn();
  const mockHandleResetMarcPreview = jest.fn();
  const mockHandleModalClose = jest.fn();
  const mockOnSegmentEnter = jest.fn();
  const mockCheckFailedId = jest.fn();
  const mockHandleHubTitleClick = jest.fn();
  const mockHandleHubAssign = jest.fn();
  const mockHandleCloseHubPreview = jest.fn();
  const mockHandleResetHubPreview = jest.fn();
  const mockHandleHubPreviewAssign = jest.fn();

  beforeEach(() => {
    (ComplexLookupHooks.useComplexLookupModalState as jest.Mock).mockReturnValue(undefined);
    (ComplexLookupHooks.useAuthoritiesModalLogic as jest.Mock).mockReturnValue({
      isMarcPreviewOpen: false,
      isMarcLoading: false,
      authoritiesData: {
        onSegmentEnter: mockOnSegmentEnter,
      },
      handleTitleClick: mockHandleTitleClick,
      handleAuthoritiesAssign: mockHandleAuthoritiesAssign,
      handleCloseMarcPreview: mockHandleCloseMarcPreview,
      handleResetMarcPreview: mockHandleResetMarcPreview,
      checkFailedId: mockCheckFailedId,
      cleanup: {
        setIsMarcPreviewOpen: jest.fn(),
        resetPreview: jest.fn(),
        resetMarcPreviewData: jest.fn(),
        resetMarcPreviewMetadata: jest.fn(),
      },
    });
    (ComplexLookupHooks.useHubsLookupModalLogic as jest.Mock).mockReturnValue({
      isHubPreviewOpen: false,
      isPreviewLoading: false,
      isAssigning: false,
      previewData: null,
      previewMeta: null,
      handleHubTitleClick: mockHandleHubTitleClick,
      handleHubAssign: mockHandleHubAssign,
      handleCloseHubPreview: mockHandleCloseHubPreview,
      handleResetHubPreview: mockHandleResetHubPreview,
      handleHubPreviewAssign: mockHandleHubPreviewAssign,
    });
    (ComplexLookupHooks.useComplexLookupModalCleanup as jest.Mock).mockReturnValue({
      handleModalClose: mockHandleModalClose,
    });
  });

  describe('Modal visibility', () => {
    it('renders modal when isOpen is true', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('ld.searchSubjectAuthority');
    });

    it('does not render modal when isOpen is false', () => {
      render(<SubjectModal isOpen={false} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Modal state management', () => {
    it('calls useComplexLookupModalState with browse segment by default', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        assignedValue: undefined,
        defaultSegment: 'authorities:browse',
      });
    });

    it('calls useComplexLookupModalState with search segment when specified', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} initialSegment="search" />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        assignedValue: undefined,
        defaultSegment: 'authorities:search',
      });
    });

    it('passes assignedValue to useComplexLookupModalState', () => {
      const assignedValue = { label: 'Test Query' } as UserValueContents;
      render(
        <SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} assignedValue={assignedValue} />,
      );

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedValue: { label: 'Test Query' },
        }),
      );
    });
  });

  describe('Authorities modal logic integration', () => {
    it('calls useAuthoritiesModalLogic with correct parameters without complex flow', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useAuthoritiesModalLogic).toHaveBeenCalledWith({
        entry: undefined,
        lookupContext: undefined,
        modalConfig: undefined,
        onAssign: mockOnAssign,
        onClose: mockOnClose,
        isOpen: true,
      });
    });

    it('calls useAuthoritiesModalLogic with complex flow parameters when provided', () => {
      const mockEntry = { uuid: 'entry_1' } as SchemaEntry;
      const mockLookupContext = 'test-context';
      const mockModalConfig = { type: 'authorities' } as unknown as ModalConfig;

      render(
        <SubjectModal
          isOpen={true}
          onClose={mockOnClose}
          onAssign={mockOnAssign}
          entry={mockEntry}
          lookupContext={mockLookupContext}
          modalConfig={mockModalConfig}
        />,
      );

      expect(ComplexLookupHooks.useAuthoritiesModalLogic).toHaveBeenCalledWith({
        entry: mockEntry,
        lookupContext: mockLookupContext,
        modalConfig: mockModalConfig,
        onAssign: mockOnAssign,
        onClose: mockOnClose,
        isOpen: true,
      });
    });
  });

  describe('Modal cleanup integration', () => {
    it('calls useComplexLookupModalCleanup with cleanup object', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useComplexLookupModalCleanup).toHaveBeenCalledWith({
        onClose: mockOnClose,
        withMarcPreview: expect.objectContaining({
          setIsMarcPreviewOpen: expect.any(Function),
          resetPreview: expect.any(Function),
          resetMarcPreviewData: expect.any(Function),
          resetMarcPreviewMetadata: expect.any(Function),
        }),
      });
    });

    it('uses handleModalClose from useComplexLookupModalCleanup for modal close', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      screen.getByTestId('modal-close').click();

      expect(mockHandleModalClose).toHaveBeenCalled();
    });
  });

  describe('Content rendering', () => {
    it('renders AuthoritiesContent with correct props', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const authContent = screen.getByTestId('authorities-content');
      expect(authContent).toBeInTheDocument();
      expect(screen.getByTestId('marc-preview-open')).toHaveTextContent('false');
      expect(screen.getByTestId('marc-loading')).toHaveTextContent('false');
      expect(screen.getByTestId('has-complex-flow')).toHaveTextContent('false');
    });

    it('renders AuthoritiesContent with hasComplexFlow true when entry and context provided', () => {
      const mockEntry = { uuid: 'entry_1' } as SchemaEntry;
      const mockLookupContext = 'test-context';
      const mockModalConfig = { type: 'authorities' } as unknown as ModalConfig;

      render(
        <SubjectModal
          isOpen={true}
          onClose={mockOnClose}
          onAssign={mockOnAssign}
          entry={mockEntry}
          lookupContext={mockLookupContext}
          modalConfig={mockModalConfig}
        />,
      );

      expect(screen.getByTestId('has-complex-flow')).toHaveTextContent('true');
    });

    it('renders HubsContent with correct props', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('hubs-content')).toBeInTheDocument();
    });

    it('passes checkFailedId to AuthoritiesContent', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('auth-has-check-failed-id')).toBeInTheDocument();
    });
  });

  describe('Authorities assignment flow', () => {
    it('calls handleAuthoritiesAssign when authority is assigned', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      screen.getByText('Assign Authority').click();

      expect(mockHandleAuthoritiesAssign).toHaveBeenCalledWith({ id: 'auth_1', title: 'Authority 1' });
      expect(mockOnAssign).not.toHaveBeenCalled();
    });

    it('calls handleTitleClick when MARC view is requested', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      screen.getByText('View MARC').click();

      expect(mockHandleTitleClick).toHaveBeenCalledWith('auth_1');
    });

    it('calls handleCloseMarcPreview when MARC preview is closed', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      screen.getByText('Close MARC').click();

      expect(mockHandleCloseMarcPreview).toHaveBeenCalled();
    });
  });

  describe('Hubs assignment flow', () => {
    it('calls handleHubAssign when hub is assigned', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      screen.getByText('Assign Hub').click();

      expect(mockHandleHubAssign).toHaveBeenCalledWith({ id: 'hub_1', title: 'Hub 1' });
    });

    it('calls handleCloseHubPreview when close is triggered from HubsContent', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const closeButtons = screen.getAllByText('Close');
      closeButtons[1].click();

      expect(mockHandleCloseHubPreview).toHaveBeenCalled();
    });
  });

  describe('Search integration', () => {
    it('renders search component with correct structure', () => {
      render(<SubjectModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('search')).toBeInTheDocument();
    });
  });
});
