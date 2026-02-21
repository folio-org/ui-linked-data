import { useCallback } from 'react';

import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';
import { useAuthoritiesAssignment } from '@/features/complexLookup/hooks/useAuthoritiesAssignment';
import { useAuthoritiesMarcPreview } from '@/features/complexLookup/hooks/useAuthoritiesMarcPreview';
import { useAuthoritiesSegmentData } from '@/features/complexLookup/hooks/useAuthoritiesSegmentData';

import { useMarcPreviewState, useUIState } from '@/store';

interface UseAuthoritiesModalLogicParams {
  entry?: SchemaEntry;
  lookupContext?: string;
  modalConfig?: ModalConfig;
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
  isOpen: boolean;
}

interface AuthoritiesModalCleanup {
  setIsMarcPreviewOpen: (open: boolean) => void;
  resetPreview: VoidFunction;
  resetMarcPreviewData: VoidFunction;
  resetMarcPreviewMetadata: VoidFunction;
}

interface UseAuthoritiesModalLogicResult {
  // State
  isMarcPreviewOpen: boolean;
  isMarcLoading: boolean;
  authoritiesData: {
    onSegmentEnter: VoidFunction;
  };

  // Handlers
  handleTitleClick: (id: string, title?: string, headingType?: string) => void;
  handleAuthoritiesAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  handleCloseMarcPreview: VoidFunction;
  handleResetMarcPreview: VoidFunction;

  // Assignment state
  checkFailedId?: (id?: string) => boolean;

  // Cleanup (for modal close handler)
  cleanup: AuthoritiesModalCleanup;
}

/**
 * Hook to encapsulate all authorities-specific modal logic
 */
export function useAuthoritiesModalLogic({
  entry,
  lookupContext,
  modalConfig,
  onAssign,
  onClose,
  isOpen,
}: UseAuthoritiesModalLogicParams): UseAuthoritiesModalLogicResult {
  const { isMarcPreviewOpen, setIsMarcPreviewOpen } = useUIState(['isMarcPreviewOpen', 'setIsMarcPreviewOpen']);
  const { resetComplexValue: resetMarcPreviewData, resetMetadata: resetMarcPreviewMetadata } = useMarcPreviewState([
    'resetComplexValue',
    'resetMetadata',
  ]);

  const hasComplexFlow = !!(entry && lookupContext && modalConfig);
  const marcPreviewEndpoint = modalConfig?.api?.endpoints?.marcPreview;
  const sourceEndpoint = modalConfig?.api?.endpoints?.source;
  const facetsEndpoint = modalConfig?.api?.endpoints?.facets;

  // Load source/facets on segment toggle and initial load
  const authoritiesData = useAuthoritiesSegmentData({
    sourceEndpoint,
    facetsEndpoint,
    facet: 'sourceFileId',
    autoLoadOnMount: true,
    isOpen,
  });

  // Handle MARC preview loading and state management
  const {
    loadMarcData,
    resetPreview,
    isLoading: isMarcLoading,
  } = useAuthoritiesMarcPreview({
    endpointUrl: marcPreviewEndpoint || '',
    isMarcPreviewOpen,
  });

  // Cleanup and close handler after successful assignment
  const handleSuccessfulAssignment = useCallback(
    (value: UserValueContents | ComplexLookupAssignRecordDTO) => {
      resetPreview();
      setIsMarcPreviewOpen(false);
      onAssign(value);
      onClose();
    },
    [resetPreview, setIsMarcPreviewOpen, onAssign, onClose],
  );

  // Complex assignment validation hook
  const authoritiesAssignment = useAuthoritiesAssignment({
    entry: entry || ({} as SchemaEntry),
    lookupContext: lookupContext || '',
    modalConfig: modalConfig || ({} as ModalConfig),
    onAssignSuccess: handleSuccessfulAssignment,
    enabled: hasComplexFlow,
  });

  // Wrapper to handle opening the preview modal
  const handleTitleClick = useCallback(
    (id: string, title?: string, headingType?: string) => {
      loadMarcData(id, title, headingType);
      setIsMarcPreviewOpen(true);
    },
    [loadMarcData, setIsMarcPreviewOpen],
  );

  const handleAuthoritiesAssign = useCallback(
    async (record: ComplexLookupAssignRecordDTO) => {
      if (hasComplexFlow) {
        // Complex flow with validation
        await authoritiesAssignment.handleAssign(record);
      } else {
        // Simple flow
        handleSuccessfulAssignment(record);
      }
    },
    [hasComplexFlow, authoritiesAssignment, handleSuccessfulAssignment],
  );

  const handleCloseMarcPreview = useCallback(() => {
    resetPreview();
    setIsMarcPreviewOpen(false);
  }, [resetPreview, setIsMarcPreviewOpen]);

  const handleResetMarcPreview = useCallback(() => {
    resetPreview();
    setIsMarcPreviewOpen(false);
  }, [resetPreview, setIsMarcPreviewOpen]);

  return {
    isMarcPreviewOpen,
    isMarcLoading,
    authoritiesData,
    handleTitleClick,
    handleAuthoritiesAssign,
    handleCloseMarcPreview,
    handleResetMarcPreview,
    checkFailedId: authoritiesAssignment?.checkFailedId,
    cleanup: {
      setIsMarcPreviewOpen,
      resetPreview,
      resetMarcPreviewData,
      resetMarcPreviewMetadata,
    },
  };
}
