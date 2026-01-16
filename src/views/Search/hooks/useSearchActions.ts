import { useCallback } from 'react';
import { logger } from '@/common/services/logger';
import { useNavigateToCreatePage } from '@/common/hooks/useNavigateToCreatePage';
import { useNavigateToManageProfileSettings } from '@/common/hooks/useNavigateToManageProfileSettings';
import { useInputsState, useLoadingState, useSearchState, useStatusState, useUIState } from '@src/store';
import { StatusType } from '@/common/constants/status.constants';
import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { FullDisplayType } from '@/common/constants/uiElements.constants';
import { ResourceType } from '@/common/constants/record.constants';
import { IS_HUBS_CREATE_ENABLED } from '@/common/constants/feature.constants';

/**
 * Custom hook that encapsulates all search-related action handlers
 */
export const useSearchActions = () => {
  const { selectedInstances } = useSearchState(['selectedInstances']);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { fetchRecord } = useRecordControls();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { setFullDisplayComponentType, isImportModalOpen, setIsImportModalOpen } = useUIState([
    'setFullDisplayComponentType',
    'isImportModalOpen',
    'setIsImportModalOpen',
  ]);
  const { resetPreviewContent } = useInputsState(['resetPreviewContent']);
  const { onCreateNewResource } = useNavigateToCreatePage();
  const { navigateToManageProfileSettings } = useNavigateToManageProfileSettings();

  /**
   * Handles previewing multiple selected instances for comparison
   */
  const handlePreviewMultiple = useCallback(async () => {
    try {
      setIsLoading(true);
      resetPreviewContent();
      setFullDisplayComponentType(FullDisplayType.Comparison);

      for (const id of selectedInstances.toReversed()) {
        await fetchRecord(id, {});
      }
    } catch (error) {
      logger.error('Error fetching records for preview:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedInstances,
    setIsLoading,
    resetPreviewContent,
    setFullDisplayComponentType,
    fetchRecord,
    addStatusMessagesItem,
  ]);

  /**
   * Opens the import modal
   */
  const handleImport = useCallback(() => {
    if (!isImportModalOpen) {
      setIsImportModalOpen(true);
    }
  }, [isImportModalOpen, setIsImportModalOpen]);

  /**
   * Navigates to create a new Work resource
   */
  const onClickNewWork = useCallback(() => {
    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.WORK as ResourceTypeURL,
      queryParams: {
        type: ResourceType.work,
      },
    });
  }, [onCreateNewResource]);

  /**
   * Navigates to create a new Hub resource
   */
  const onClickNewHub = useCallback(() => {
    if (!IS_HUBS_CREATE_ENABLED) return;

    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.HUB as ResourceTypeURL,
      queryParams: {
        type: ResourceType.hub,
      },
    });
  }, [onCreateNewResource]);

  // TODO: UILD-694 - implement Hub edit functionality
  const handleHubEdit = useCallback(() => {}, []);

  // TODO: UILD-694 - implement Hub import functionality
  const handleHubImport = useCallback(() => {}, []);

  return {
    handlePreviewMultiple,
    handleImport,
    onClickNewWork,
    onClickNewHub,
    handleHubEdit,
    handleHubImport,
    navigateToManageProfileSettings,
  };
};
