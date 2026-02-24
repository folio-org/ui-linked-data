import { useCallback } from 'react';

import { useHubAssignment } from '@/features/complexLookup/hooks/useHubAssignment';
import { useHubPreview } from '@/features/complexLookup/hooks/useHubPreview';

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
    previewMeta,
  } = useHubPreview({
    isPreviewOpen: isHubPreviewOpen,
  });

  // Cleanup and close handler after successful assignment
  const handleSuccessfulAssignment = useCallback(
    (value: UserValueContents) => {
      resetPreview();
      setIsHubPreviewOpen(false);
      onAssign(value);
      onClose();
    },
    [resetPreview, setIsHubPreviewOpen, onAssign, onClose],
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

  const handleCloseHubPreview = useCallback(() => {
    resetPreview();
    resetIsHubPreviewOpen();
  }, [resetPreview, resetIsHubPreviewOpen]);

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
    isAssigning,
    previewData,
    previewMeta,
    handleHubTitleClick,
    handleHubAssign: handleAssign,
    handleCloseHubPreview,
    handleResetHubPreview: handleCloseHubPreview,
    handleHubPreviewAssign,
    cleanup: {
      resetIsHubPreviewOpen,
      resetPreview,
    },
  };
}
