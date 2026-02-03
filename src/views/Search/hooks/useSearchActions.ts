import { useCallback } from 'react';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { ResourceType } from '@/common/constants/record.constants';
import { StatusType } from '@/common/constants/status.constants';
import { FullDisplayType } from '@/common/constants/uiElements.constants';
import { useNavigateToCreatePage } from '@/common/hooks/useNavigateToCreatePage';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useNavigateToManageProfileSettings } from '@/features/manageProfileSettings/hooks/useNavigateToManageProfileSettings';

import { useInputsState, useLoadingState, useSearchState, useStatusState, useUIState } from '@/store';

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
    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.HUB as ResourceTypeURL,
      queryParams: {
        type: ResourceType.hub,
      },
    });
  }, [onCreateNewResource]);

  return {
    handlePreviewMultiple,
    handleImport,
    onClickNewWork,
    onClickNewHub,
    navigateToManageProfileSettings,
  };
};
