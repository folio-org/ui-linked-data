import { useComplexLookupModalCleanup } from '@/features/complexLookup/hooks/useComplexLookupModalCleanup';
import { useHubsModalLogic } from '@/features/complexLookup/hooks/useHubsModalLogic';
import { HubPreviewProps } from '@/features/complexLookup/types/hubPreview.types';

interface MarcPreviewCleanup {
  setIsMarcPreviewOpen: (open: boolean) => void;
  resetPreview: VoidFunction;
  resetMarcPreviewData: VoidFunction;
  resetMarcPreviewMetadata: VoidFunction;
}

interface UseModalWithHubPreviewParams {
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
  withMarcPreview?: MarcPreviewCleanup;
}

interface UseModalWithHubPreviewResult {
  hubPreviewProps: HubPreviewProps;
  handleModalClose: VoidFunction;
}

/**
 * Reusable hook that integrates hub preview functionality into complex lookup modals.
 */
export function useModalWithHubPreview({
  onAssign,
  onClose,
  withMarcPreview,
}: UseModalWithHubPreviewParams): UseModalWithHubPreviewResult {
  const hubsLogic = useHubsModalLogic({ onAssign, onClose });

  const { handleModalClose } = useComplexLookupModalCleanup({
    onClose,
    withMarcPreview,
    withHubPreview: hubsLogic.cleanup,
  });

  return {
    hubPreviewProps: {
      isHubPreviewOpen: hubsLogic.isHubPreviewOpen,
      isPreviewLoading: hubsLogic.isPreviewLoading,
      isAssigning: hubsLogic.isAssigning,
      previewData: hubsLogic.previewData,
      previewMeta: hubsLogic.previewMeta,
      handleHubTitleClick: hubsLogic.handleHubTitleClick,
      handleHubAssign: hubsLogic.handleHubAssign,
      handleCloseHubPreview: hubsLogic.handleCloseHubPreview,
      handleHubPreviewAssign: hubsLogic.handleHubPreviewAssign,
    },
    handleModalClose,
  };
}
