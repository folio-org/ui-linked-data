import { useCallback, useEffect } from 'react';

import { useHubAssignment } from '@/features/complexLookup/hooks/useHubAssignment';
import { useHubPreviewQuery } from '@/features/complexLookup/hooks/useHubPreviewQuery';

import { useUIState } from '@/store';

interface HubResourceData {
  base: Schema;
  userValues: UserValues;
  initKey: string;
}

interface HubPreviewData {
  id: string;
  resource: HubResourceData;
}

interface UseHubsModalLogicParams {
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
}

interface HubsModalCleanup {
  resetIsHubPreviewOpen: VoidFunction;
  resetPreview: VoidFunction;
}

interface UseHubsModalLogicResult {
  // State
  isHubPreviewOpen: boolean;
  isPreviewLoading: boolean;
  isPreviewError: boolean;
  isAssigning: boolean;
  previewData: HubPreviewData | null;
  previewMeta: { id: string; title: string } | null;

  // Handlers
  handleHubTitleClick: (id: string, title?: string) => void;
  handleHubAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  handleCloseHubPreview: VoidFunction;
  handleResetHubPreview: VoidFunction;
  handleHubPreviewAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;

  // Cleanup (for modal close handler)
  cleanup: HubsModalCleanup;
}

/**
 * Hook to encapsulate hub-specific modal and assignment logic.
 */
export function useHubsModalLogic({ onAssign, onClose }: UseHubsModalLogicParams): UseHubsModalLogicResult {
  const { isHubPreviewOpen, setIsHubPreviewOpen, resetIsHubPreviewOpen } = useUIState([
    'isHubPreviewOpen',
    'setIsHubPreviewOpen',
    'resetIsHubPreviewOpen',
  ]);

  // Handle hub preview loading and state management
  const {
    loadHubPreview,
    resetPreview,
    previewData,
    isLoading: isPreviewLoading,
    isError: isPreviewError,
    previewMeta,
  } = useHubPreviewQuery({
    isPreviewOpen: isHubPreviewOpen,
  });

  const closeHubPreview = useCallback(() => {
    resetPreview();
    resetIsHubPreviewOpen();
  }, [resetPreview, resetIsHubPreviewOpen]);

  // Auto-close preview on error
  useEffect(() => {
    if (isPreviewError && isHubPreviewOpen) {
      closeHubPreview();
    }
  }, [isPreviewError, isHubPreviewOpen, closeHubPreview]);

  // Cleanup and close handler after successful assignment
  const handleSuccessfulAssignment = useCallback(
    (value: UserValueContents) => {
      closeHubPreview();
      onAssign(value);
      onClose();
    },
    [closeHubPreview, onAssign, onClose],
  );

  // Hub assignment with import-on-assign logic
  const { handleAssign, isAssigning } = useHubAssignment({
    onAssignSuccess: handleSuccessfulAssignment,
  });

  // Called when user clicks a local hub title link in the results list
  const handleHubTitleClick = useCallback(
    (id: string, title?: string) => {
      loadHubPreview(id, title || id);
      setIsHubPreviewOpen(true);
    },
    [loadHubPreview, setIsHubPreviewOpen],
  );

  // Assign from the preview panel (always local hubs)
  const handleHubPreviewAssign = useCallback(
    async (record: ComplexLookupAssignRecordDTO) => {
      await handleAssign(record);
    },
    [handleAssign],
  );

  return {
    isHubPreviewOpen,
    isPreviewLoading,
    isPreviewError,
    isAssigning,
    previewData,
    previewMeta,
    handleHubTitleClick,
    handleHubAssign: handleAssign,
    handleCloseHubPreview: closeHubPreview,
    handleResetHubPreview: closeHubPreview,
    handleHubPreviewAssign,
    cleanup: {
      resetIsHubPreviewOpen,
      resetPreview,
    },
  };
}
