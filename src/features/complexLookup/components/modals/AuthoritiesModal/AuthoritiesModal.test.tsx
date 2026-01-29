import { fireEvent, render, screen } from '@testing-library/react';

import { useServicesContext } from '@/common/hooks/useServicesContext';
import { setInitialGlobalState } from '@/test/__mocks__/store';

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

    it('passes initialQuery to useComplexLookupModalState', () => {
      render(
        <AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} initialQuery="Test Query" />,
      );

      expect(ComplexLookupHooks.useComplexLookupModalState).toHaveBeenCalledWith(
        expect.objectContaining({
          initialQuery: 'Test Query',
        }),
      );
    });
  });

  describe('MARC preview integration', () => {
    it('calls useAuthoritiesMarcPreview with correct endpoint', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(ComplexLookupHooks.useAuthoritiesMarcPreview).toHaveBeenCalledWith(
        expect.objectContaining({
          endpointUrl: expect.any(String),
          isMarcPreviewOpen: false,
        }),
      );
    });

    it('shows MARC preview when isMarcPreviewOpen is true', () => {
      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: true,
            setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
          },
        },
      ]);

      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('marc-preview')).toBeInTheDocument();
      expect(screen.queryByTestId('authorities-result-list')).not.toBeInTheDocument();
    });

    it('shows loading state when MARC preview is loading', () => {
      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: true,
            setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
          },
        },
      ]);
      (ComplexLookupHooks.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
        loadMarcData: mockLoadMarcData,
        resetPreview: mockResetPreview,
        isLoading: true,
      });

      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('marc-preview')).not.toBeInTheDocument();
    });

    it('closes MARC preview and resets state when close button is clicked', () => {
      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: true,
            setIsMarcPreviewOpen: mockSetIsMarcPreviewOpen,
          },
        },
      ]);

      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('marc-preview-close'));

      expect(mockResetPreview).toHaveBeenCalled();
      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('Title click handling', () => {
    it('loads MARC data and opens preview when title is clicked', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('View MARC'));

      expect(mockLoadMarcData).toHaveBeenCalledWith('auth-1', 'Authority 1', 'Personal Name');
      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(true);
    });
  });

  describe('Search integration', () => {
    it('renders search component with correct structure', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      expect(screen.getByTestId('search')).toBeInTheDocument();
      expect(screen.getByTestId('complex-lookup-search-contents')).toBeInTheDocument();
    });

    it('renders AuthoritiesResultList with complexLookup context', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      const resultList = screen.getByTestId('authorities-result-list');
      expect(resultList).toBeInTheDocument();
      expect(resultList).toHaveTextContent('complexLookup');
    });

    it('passes onAssign to AuthoritiesResultList', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(mockOnAssign).toHaveBeenCalledWith({ id: 'auth-1', title: 'Authority 1' });
    });
  });

  describe('handleSuccessfulAssignment', () => {
    it('resets preview state when assignment succeeds', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(mockResetPreview).toHaveBeenCalled();
    });

    it('closes MARC preview when assignment succeeds', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(false);
    });

    it('calls onAssign with the assigned record', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(mockOnAssign).toHaveBeenCalledWith({ id: 'auth-1', title: 'Authority 1' });
    });

    it('calls onClose after successful assignment', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('executes cleanup operations in correct order', () => {
      const callOrder: string[] = [];
      const trackingResetPreview = jest.fn(() => callOrder.push('resetPreview'));
      const trackingSetIsMarcPreviewOpen = jest.fn(() => callOrder.push('setIsMarcPreviewOpen'));
      const trackingOnAssign = jest.fn(() => callOrder.push('onAssign'));
      const trackingOnClose = jest.fn(() => callOrder.push('onClose'));

      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: false,
            setIsMarcPreviewOpen: trackingSetIsMarcPreviewOpen,
          },
        },
      ]);
      (ComplexLookupHooks.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
        loadMarcData: mockLoadMarcData,
        resetPreview: trackingResetPreview,
        isLoading: false,
      });

      render(<AuthoritiesModal isOpen={true} onClose={trackingOnClose} onAssign={trackingOnAssign} />);

      fireEvent.click(screen.getByText('Assign Authority'));

      expect(callOrder).toEqual(['resetPreview', 'setIsMarcPreviewOpen', 'onAssign', 'onClose']);
    });
  });

  describe('handleModalClose', () => {
    it('closes MARC preview when modal closes', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('modal-close'));

      expect(mockSetIsMarcPreviewOpen).toHaveBeenCalledWith(false);
    });

    it('resets MARC preview data when modal closes', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('modal-close'));

      expect(mockResetComplexValue).toHaveBeenCalled();
    });

    it('resets MARC preview metadata when modal closes', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('modal-close'));

      expect(mockResetMetadata).toHaveBeenCalled();
    });

    it('resets preview state when modal closes', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('modal-close'));

      expect(mockResetPreview).toHaveBeenCalled();
    });

    it('calls onClose callback', () => {
      render(<AuthoritiesModal isOpen={true} onClose={mockOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('modal-close'));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('executes all cleanup operations in correct order', () => {
      const callOrder: string[] = [];
      const trackingSetIsMarcPreviewOpen = jest.fn(() => callOrder.push('setIsMarcPreviewOpen'));
      const trackingResetComplexValue = jest.fn(() => callOrder.push('resetComplexValue'));
      const trackingResetMetadata = jest.fn(() => callOrder.push('resetMetadata'));
      const trackingResetPreview = jest.fn(() => callOrder.push('resetPreview'));
      const trackingOnClose = jest.fn(() => callOrder.push('onClose'));

      setInitialGlobalState([
        {
          store: useUIState,
          state: {
            isMarcPreviewOpen: false,
            setIsMarcPreviewOpen: trackingSetIsMarcPreviewOpen,
          },
        },
        {
          store: useMarcPreviewState,
          state: {
            resetComplexValue: trackingResetComplexValue,
            resetMetadata: trackingResetMetadata,
          },
        },
      ]);
      (ComplexLookupHooks.useAuthoritiesMarcPreview as jest.Mock).mockReturnValue({
        loadMarcData: mockLoadMarcData,
        resetPreview: trackingResetPreview,
        isLoading: false,
      });

      render(<AuthoritiesModal isOpen={true} onClose={trackingOnClose} onAssign={mockOnAssign} />);

      fireEvent.click(screen.getByTestId('modal-close'));

      expect(callOrder).toEqual([
        'setIsMarcPreviewOpen',
        'resetComplexValue',
        'resetMetadata',
        'resetPreview',
        'onClose',
      ]);
    });
  });
});
