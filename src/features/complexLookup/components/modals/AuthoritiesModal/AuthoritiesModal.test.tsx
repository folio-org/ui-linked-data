import { setInitialGlobalState } from '@/test/__mocks__/store';

import { fireEvent, render, screen } from '@testing-library/react';

import { useServicesContext } from '@/common/hooks/useServicesContext';

import * as ComplexLookupHooks from '@/features/complexLookup/hooks';

import {
  useComplexLookupState,
  useInputsState,
  useLoadingState,
  useMarcPreviewState,
  useProfileState,
  useStatusState,
  useUIState,
} from '@/store';

import { AuthoritiesModal } from './AuthoritiesModal';

jest.mock('@/features/complexLookup/hooks', () => ({
  useComplexLookupModalState: jest.fn(),
  useAuthoritiesModalLogic: jest.fn(),
  useComplexLookupModalCleanup: jest.fn(),
  useAuthoritiesMarcPreview: jest.fn(),
  useAuthoritiesSegmentData: jest.fn(),
  useAuthoritiesAssignment: jest.fn(),
}));

jest.mock('@/common/hooks/useServicesContext', () => ({
  useServicesContext: jest.fn(),
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
  AuthoritiesResultList: ({
    context,
    onAssign,
    onTitleClick,
  }: {
    context: string;
    onAssign: (record: ComplexLookupAssignRecordDTO) => void;
    onTitleClick: (id: string, title?: string, headingType?: string) => void;
  }) => (
    <div data-testid="authorities-result-list">
      <span>{context}</span>
      <button onClick={() => onAssign({ id: 'auth-1', title: 'Authority 1' })}>Assign Authority</button>
      <button onClick={() => onTitleClick('auth-1', 'Authority 1', 'Personal Name')}>View MARC</button>
    </div>
  ),
}));

jest.mock('@/features/complexLookup/components/MarcPreview', () => ({
  MarcPreview: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="marc-preview">
      <button onClick={onClose} data-testid="marc-preview-close">
        Close Preview
      </button>
    </div>
  ),
}));

jest.mock('@/components/Loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

describe('AuthoritiesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAssign = jest.fn();
  const mockSetIsMarcPreviewOpen = jest.fn();
  const mockResetComplexValue = jest.fn();
  const mockResetMetadata = jest.fn();
  const mockLoadMarcData = jest.fn();
  const mockResetPreview = jest.fn();
  const mockOnSegmentEnter = jest.fn();
  const mockRefetchSource = jest.fn();
  const mockRefetchFacets = jest.fn();
  const mockHandleTitleClick = jest.fn();
  const mockHandleAuthoritiesAssign = jest.fn();
  const mockHandleCloseMarcPreview = jest.fn();
  const mockHandleModalClose = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isMarcPreviewOpen: false,
          setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
        },
      },
      {
        store: useMarcPreviewState,
        state: {
          resetComplexValue: mockResetComplexValue,
          resetMetadata: mockResetMetadata,
        },
      },
      {
        store: useProfileState,
        state: {
          schema: {},
        },
      },
      {
        store: useInputsState,
        state: {
          selectedEntries: [],
          setSelectedEntries: jest.fn(),
        },
      },
      {
        store: useStatusState,
        state: {
          addStatusMessagesItem: jest.fn(),
        },
      },
      {
        store: useLoadingState,
        state: {
          setIsLoading: jest.fn(),
        },
      },
      {
        store: useComplexLookupState,
        state: {
          authorityAssignmentCheckFailedIds: [],
          addAuthorityAssignmentCheckFailedIdsItem: jest.fn(),
          resetAuthorityAssignmentCheckFailedIds: jest.fn(),
        },
      },
    ]);

    (useServicesContext as jest.Mock).mockReturnValue({
      selectedEntriesService: {},
    });
    (ComplexLookupHooks.useComplexLookupModalState as jest.Mock).mockReturnValue(undefined);
    (ComplexLookupHooks.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
      loadMarcData: mockLoadMarcData,
      resetPreview: mockResetPreview,
      isLoading: false,
    });
    (ComplexLookupHooks.useAuthoritiesSegmentData as jest.Mock).mockReturnValue({
      sourceData: null,
      facetsData: null,
      isLoading: false,
      onSegmentEnter: mockOnSegmentEnter,
      refetchSource: mockRefetchSource,
      refetchFacets: mockRefetchFacets,
    });
    (ComplexLookupHooks.useAuthoritiesAssignment as jest.Mock).mockReturnValue({
      validateAndAssign: jest.fn(),
      isValidating: false,
    });
    (ComplexLookupHooks.useAuthoritiesModalLogic as jest.Mock).mockReturnValue({
      isMarcPreviewOpen: false,
      isMarcLoading: false,
      authoritiesData: {
        onSegmentEnter: mockOnSegmentEnter,
      },
      handleTitleClick: mockHandleTitleClick,
      handleAuthoritiesAssign: mockHandleAuthoritiesAssign,
      handleCloseMarcPreview: mockHandleCloseMarcPreview,
      handleResetMarcPreview: jest.fn(),
      checkFailedId: undefined,
      cleanup: {
        setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
        resetPreview: mockResetPreview,
        resetMarcPreviewData: mockResetComplexValue,
        resetMarcPreviewMetadata: mockResetMetadata,
      },
    });
    (ComplexLookupHooks.useComplexLookupModalCleanup as jest.Mock).mockReturnValue({
      handleModalClose: mockHandleModalClose,
    });
  });

  describe('Modal visibility', () => {
    it('renders modal when isOpen is true', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('ld.selectMarcAuthority');
    });

    it('does not render modal when isOpen is false', () => {
      render(<AuthoritiesModal isOpen={false} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Modal state management', () => {
    it('calls useComplexLookupModalState with browse segment by default', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        initialQuery: undefined,
        defaultSegment: 'authorities:browse',
      });
    });

    it('calls useComplexLookupModalState with search segment when specified', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} initialSegment="search" />);

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith({
        isOpen: true,
        initialQuery: undefined,
        defaultSegment: 'authorities:search',
      });
    });

    it('passes assignedValue to useComplexLookupModalState', () => {
      const assignedValue = { label: 'Test Query' } as UserValueContents;
      render(
        <AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} assignedValue={assignedValue} />,
      );

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedValue: { label: 'Test Query' },
        }),
      );
    });
  });

  describe('MARC preview integration', () => {
    it('calls useAuthoritiesModalLogic with correct parameters', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useAuthoritiesModalLogic).toHaveBeenCalledWith({
        entry: undefined,
        lookupContext: undefined,
        modalConfig: undefined,
        onAssign: mockOnAssign,
        onClose: mockOnClose,
        isOpen: true,
      });
    });

    it('shows MARC preview when isMarcPreviewOpen is true', () => {
      (ComplexLookupHooks.useAuthoritiesModalLogic as jest.Mock).mockReturnValue({
        isMarcPreviewOpen: true,
        isMarcLoading: false,
        authoritiesData: {
          onSegmentEnter: mockOnSegmentEnter,
        },
        handleTitleClick: mockHandleTitleClick,
        handleAuthoritiesAssign: mockHandleAuthoritiesAssign,
        handleCloseMarcPreview: mockHandleCloseMarcPreview,
        handleResetMarcPreview: jest.fn(),
        checkFailedId: undefined,
        cleanup: {
          setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
          resetPreview: mockResetPreview,
          resetMarcPreviewData: mockResetComplexValue,
          resetMarcPreviewMetadata: mockResetMetadata,
        },
      });

      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('marc-preview')).toBeInTheDocument();
      expect(screen.queryByTestId('authorities-result-list')).not.toBeInTheDocument();
    });

    it('shows loading state when MARC preview is loading', () => {
      (ComplexLookupHooks.useAuthoritiesModalLogic as jest.Mock).mockReturnValue({
        isMarcPreviewOpen: true,
        isMarcLoading: true,
        authoritiesData: {
          onSegmentEnter: mockOnSegmentEnter,
        },
        handleTitleClick: mockHandleTitleClick,
        handleAuthoritiesAssign: mockHandleAuthoritiesAssign,
        handleCloseMarcPreview: mockHandleCloseMarcPreview,
        handleResetMarcPreview: jest.fn(),
        checkFailedId: undefined,
        cleanup: {
          setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
          resetPreview: mockResetPreview,
          resetMarcPreviewData: mockResetComplexValue,
          resetMarcPreviewMetadata: mockResetMetadata,
        },
      });

      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('marc-preview')).not.toBeInTheDocument();
    });

    it('closes MARC preview and resets state when close button is clicked', () => {
      (ComplexLookupHooks.useAuthoritiesModalLogic as jest.Mock).mockReturnValue({
        isMarcPreviewOpen: true,
        isMarcLoading: false,
        authoritiesData: {
          onSegmentEnter: mockOnSegmentEnter,
        },
        handleTitleClick: mockHandleTitleClick,
        handleAuthoritiesAssign: mockHandleAuthoritiesAssign,
        handleCloseMarcPreview: mockHandleCloseMarcPreview,
        handleResetMarcPreview: jest.fn(),
        checkFailedId: undefined,
        cleanup: {
          setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
          resetPreview: mockResetPreview,
          resetMarcPreviewData: mockResetComplexValue,
          resetMarcPreviewMetadata: mockResetMetadata,
        },
      });

      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('marc-preview-close'));

      expect(mockHandleCloseMarcPreview).toHaveBeenCalled();
    });
  });

  describe('Title click handling', () => {
    it('loads MARC data and opens preview when title is clicked', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('View MARC'));

      expect(mockHandleTitleClick).toHaveBeenCalledWith('auth-1', 'Authority 1', 'Personal Name');
    });
  });

  describe('Search integration', () => {
    it('renders search component with correct structure', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('search')).toBeInTheDocument();
    });

    it('renders AuthoritiesResultList with complexLookup context', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const resultList = screen.getByTestId('authorities-result-list');
      expect(resultList).toBeInTheDocument();
      expect(resultList).toHaveTextContent('complexLookup');
    });

    it('passes handleAuthoritiesAssign from useAuthoritiesModalLogic to AuthoritiesResultList', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(mockHandleAuthoritiesAssign).toHaveBeenCalledWith({ id: 'auth-1', title: 'Authority 1' });
      expect(mockOnAssign).not.toHaveBeenCalled();
    });
  });

  describe('handleSuccessfulAssignment', () => {
    it('assignment is handled by handleAuthoritiesAssign from useAuthoritiesModalLogic', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(mockHandleAuthoritiesAssign).toHaveBeenCalledWith({ id: 'auth-1', title: 'Authority 1' });
    });
  });

  describe('handleModalClose', () => {
    it('calls handleModalClose from useComplexLookupModalCleanup when modal closes', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('modal-close'));

      expect(mockHandleModalClose).toHaveBeenCalled();
    });

    it('initializes useComplexLookupModalCleanup with cleanup object', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

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
  });
});
