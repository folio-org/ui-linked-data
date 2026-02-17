import { useCallback } from 'react';

interface MarcPreviewCleanup {
  setIsMarcPreviewOpen: (open: boolean) => void;
  resetPreview: VoidFunction;
  resetMarcPreviewData: VoidFunction;
  resetMarcPreviewMetadata: VoidFunction;
}

interface UseComplexLookupModalCleanupParams {
  onClose: VoidFunction;
  withMarcPreview?: MarcPreviewCleanup;
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
}: UseComplexLookupModalCleanupParams): UseComplexLookupModalCleanupResult {
  const handleModalClose = useCallback(() => {
    // Clean up MARC preview state if applicable
    if (withMarcPreview) {
      withMarcPreview.setIsMarcPreviewOpen(false);
      withMarcPreview.resetMarcPreviewData();
      withMarcPreview.resetMarcPreviewMetadata();
      withMarcPreview.resetPreview();
    }

    // Close the modal
    onClose();
  }, [onClose, withMarcPreview]);

  return { handleModalClose };
}
