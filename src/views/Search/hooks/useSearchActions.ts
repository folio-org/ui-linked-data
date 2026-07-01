import { useCallback } from 'react';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { ImportFilterTypes } from '@/common/constants/import.constants';
import { ResourceType } from '@/common/constants/record.constants';
import { FullDisplayType } from '@/common/constants/uiElements.constants';

import { useNavigateToManageProfileSettings } from '@/features/manageProfileSettings';
import { useNavigateToCreatePage } from '@/features/profiles';

import { useUIState } from '@/store';

/**
 * Custom hook that encapsulates all search-related action handlers
 */
export const useSearchActions = () => {
  const { setFullDisplayComponentType, isImportModalOpen, setIsImportModalOpen, setImportModalFilterType } = useUIState(
    ['setFullDisplayComponentType', 'isImportModalOpen', 'setIsImportModalOpen', 'setImportModalFilterType'],
  );
  const { onCreateNewResource } = useNavigateToCreatePage();
  const { navigateToManageProfileSettings } = useNavigateToManageProfileSettings();

  /**
   * Opens the comparison view for currently selected instances.
   * Data is loaded in parallel by the Comparison component via useComparisonData.
   */
  const handlePreviewMultiple = useCallback(() => {
    setFullDisplayComponentType(FullDisplayType.Comparison);
  }, [setFullDisplayComponentType]);

  /**
   * Opens the import modal for instances
   */
  const handleImportInstances = useCallback(() => {
    if (!isImportModalOpen) {
      setImportModalFilterType(ImportFilterTypes.Instance);
      setIsImportModalOpen(true);
    }
  }, [isImportModalOpen, setIsImportModalOpen, setImportModalFilterType]);

  /**
   * Opens the import modal for hubs
   */
  const handleImportHubs = useCallback(() => {
    if (!isImportModalOpen) {
      setImportModalFilterType(ImportFilterTypes.Hub);
      setIsImportModalOpen(true);
    }
  }, [isImportModalOpen, setIsImportModalOpen, setImportModalFilterType]);

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

  /**
   * Navigates to create a new Authority resource
   */
  const onClickNewAuthority = useCallback(() => {
    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.AUTHORITY_RESOURCE_TYPE as ResourceTypeURL,
      queryParams: {
        type: ResourceType.authority,
      },
    });
  }, [onCreateNewResource]);

  return {
    handlePreviewMultiple,
    handleImportInstances,
    handleImportHubs,
    onClickNewWork,
    onClickNewHub,
    onClickNewAuthority,
    navigateToManageProfileSettings,
  };
};
