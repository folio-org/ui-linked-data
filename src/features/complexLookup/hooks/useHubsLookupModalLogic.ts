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

interface UseHubsLookupModalLogicParams {
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
}

interface HubsLookupModalCleanup {
  setIsHubPreviewOpen: (open: boolean) => void;
  resetPreview: VoidFunction;
}

interface UseHubsLookupModalLogicResult {
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
  cleanup: HubsLookupModalCleanup;
}

/**
 * Hook to orchestrate hub preview and assignment logic.
 */
export function useHubsLookupModalLogic({
  onAssign,
  onClose,
}: UseHubsLookupModalLogicParams): UseHubsLookupModalLogicResult {
  const { isHubPreviewOpen, setIsHubPreviewOpen } = useUIState(['isHubPreviewOpen', 'setIsHubPreviewOpen']);

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
    setIsHubPreviewOpen(false);
  }, [resetPreview, setIsHubPreviewOpen]);

  const handleResetHubPreview = useCallback(() => {
    resetPreview();
    setIsHubPreviewOpen(false);
  }, [resetPreview, setIsHubPreviewOpen]);

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
    handleResetHubPreview,
    handleHubPreviewAssign,
    cleanup: {
      setIsHubPreviewOpen,
      resetPreview,
    },
  };
}
