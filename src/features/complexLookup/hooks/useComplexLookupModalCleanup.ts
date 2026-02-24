import { useCallback } from 'react';

interface MarcPreviewCleanup {
  setIsMarcPreviewOpen: (open: boolean) => void;
  resetPreview: VoidFunction;
  resetMarcPreviewData: VoidFunction;
  resetMarcPreviewMetadata: VoidFunction;
}

interface HubPreviewCleanup {
  resetIsHubPreviewOpen: VoidFunction;
  resetPreview: VoidFunction;
}

interface UseComplexLookupModalCleanupParams {
  onClose: VoidFunction;
  withMarcPreview?: MarcPreviewCleanup;
  withHubPreview?: HubPreviewCleanup;
}

interface UseComplexLookupModalCleanupResult {
  handleModalClose: VoidFunction;
}

/**
 * Hook to handle modal cleanup logic consistently across complex lookup modals
 */
export function useComplexLookupModalCleanup({
  onClose,
  withMarcPreview,
  withHubPreview,
}: UseComplexLookupModalCleanupParams): UseComplexLookupModalCleanupResult {
  const handleModalClose = useCallback(() => {
    // Clean up MARC preview state if applicable
    if (withMarcPreview) {
      withMarcPreview.setIsMarcPreviewOpen(false);
      withMarcPreview.resetMarcPreviewData();
      withMarcPreview.resetMarcPreviewMetadata();
      withMarcPreview.resetPreview();
    }

    // Clean up Hub preview state if applicable
    if (withHubPreview) {
      withHubPreview.resetIsHubPreviewOpen();
      withHubPreview.resetPreview();
    }

    // Close the modal
    onClose();
  }, [onClose, withMarcPreview, withHubPreview]);

  return { handleModalClose };
}
