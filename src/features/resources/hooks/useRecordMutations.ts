import { flushSync } from 'react-dom';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { BibframeEntities } from '@/common/constants/bibframe.constants';
import { BLOCKS_BFLITE } from '@/common/constants/bibframeMapping.constants';
import { RecordStatus, ResourceType } from '@/common/constants/record.constants';
import { QueryParams, ROUTES, SearchQueryParams } from '@/common/constants/routes.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getFriendlyErrorMessage } from '@/common/helpers/api.helper';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { getRecordId, getSelectedRecordBlocks } from '@/common/helpers/record.helper';
import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { useContainerEvents } from '@/common/hooks/useContainerEvents';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { getSearchSegment, mapToResourceType } from '@/configs/resourceTypes';

import {
  RESOURCE_QUERY_KEY,
  deleteRecord as deleteRecordRequest,
  postRecord,
  putRecord,
  useRecordGeneration,
  useResourceProcessing,
} from '@/features/resources';

import { useInputsState, useLoadingState, useProfileState, useStatusState } from '@/store';

import { useRecordNavigation } from './useRecordNavigation';

type SaveRecordProps = {
  asRefToNewRecord?: boolean;
  shouldSetSearchParams?: boolean;
  isNavigatingBack?: boolean;
  profileId?: string;
};

type HandleRecordUpdateProps = {
  generatedRecord?: RecordEntry;
  recordId: string;
  updatedSelectedRecordBlocks: SelectedRecordBlocks;
  isNavigatingBack?: boolean;
  asRefToNewRecord?: boolean;
  shouldSetSearchParams?: boolean;
  isProfileChange?: boolean;
};

export const useRecordMutations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { selectedRecordBlocks, record, setRecord, setUserValues, setSelectedEntries, setSelectedRecordBlocks } =
    useInputsState([
      'selectedRecordBlocks',
      'record',
      'setRecord',
      'setUserValues',
      'setSelectedEntries',
      'setSelectedRecordBlocks',
    ]);
  const {
    setRecordStatus,
    setLastSavedRecordId,
    setIsRecordEdited: setIsEdited,
    addStatusMessagesItem,
  } = useStatusState(['setRecordStatus', 'setLastSavedRecordId', 'setIsRecordEdited', 'addStatusMessagesItem']);
  const currentRecordId = getRecordId(record);
  const { processResource } = useResourceProcessing();
  const { setSelectedProfile, setInitialSchemaKey, setSchema } = useProfileState([
    'setSelectedProfile',
    'setInitialSchemaKey',
    'setSchema',
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchResultsUri = useBackToSearchUri();
  const { dispatchUnblockEvent } = useContainerEvents();
  const [queryParams] = useSearchParams();
  const isClone = queryParams.get(QueryParams.CloneOf);
  const { generateRecord } = useRecordGeneration();
  const { discardRecord } = useRecordNavigation();
  const queryClient = useQueryClient();

  const ensureSegmentInUri = (uri: string) => {
    if (uri.includes(`${SearchQueryParams.Segment}=`)) {
      return uri;
    }

    const typeParam = searchParams.get(QueryParams.Type);
    const resourceType = mapToResourceType(typeParam);
    const segment = getSearchSegment(resourceType);
    const separator = uri.includes('?') ? '&' : '?';

    return `${uri}${separator}${SearchQueryParams.Segment}=${segment}`;
  };

  const saveRecordToApi = async (recordId: string, generatedRecord: RecordEntry) => {
    const shouldPostRecord = !recordId || isClone;

    return shouldPostRecord ? await postRecord(generatedRecord) : await putRecord(recordId, generatedRecord);
  };

  const updateStateAfterSave = (parsedResponse: RecordEntry, asRefToNewRecord: boolean, recordId: string) => {
    dispatchUnblockEvent();

    if (!asRefToNewRecord) {
      setRecord(parsedResponse);
    }

    // Show success message
    addStatusMessagesItem?.(
      UserNotificationFactory.createMessage(StatusType.success, recordId ? 'ld.rdUpdateSuccess' : 'ld.rdSaveSuccess'),
    );

    // isEdited state update is not immediately reflected in the <Prompt />
    // blocker component, forcing <Prompt /> to block the navigation call below
    // right before isEdited is set to false, disabling <Prompt />
    flushSync(() => setIsEdited(false));
  };

  const handleProfileOrNoNavigationChange = async (
    updatedRecordId: string,
    parsedResponse: RecordEntry,
    isProfileChange: boolean,
  ) => {
    navigate(generateEditResourceUrl(updatedRecordId), {
      replace: true,
      state: { ...(location.state as NavigationState), preserveStatusMessages: true },
    });

    // Always re-derive form state from the server response so server-side normalisation
    // is reflected in the form (applies to both profile changes and same-ID saves)
    const result = await processResource({ record: parsedResponse });

    if (result) {
      setSelectedProfile(result.selectedProfile ?? null);
      setSchema(result.schema);
      setInitialSchemaKey(result.initKey);
      setUserValues(result.userValues);
      setSelectedEntries(result.selectedEntries);
      setSelectedRecordBlocks(result.selectedRecordBlocks);
    }

    if (!isProfileChange) {
      setRecordStatus({ type: RecordStatus.saveAndKeepEditing });
    }

    return updatedRecordId;
  };

  const handleBackNavigation = (
    updatedRecordId: string,
    parsedResponse: RecordEntry,
    asRefToNewRecord: boolean,
    shouldSetSearchParams: boolean,
  ) => {
    setRecordStatus({ type: RecordStatus.saveAndClose });

    if (asRefToNewRecord) {
      const blocksBfliteKey = (
        searchParams.get(QueryParams.Type) ?? ResourceType.instance
      )?.toUpperCase() as BibframeEntities;

      const blockConfig = BLOCKS_BFLITE[blocksBfliteKey];
      const selectedBlock = blockConfig?.uri;

      // Only set search params if this resource type has a reference (e.g., Work/Instance)
      if (shouldSetSearchParams && blockConfig?.reference) {
        setSearchParams({
          type: blockConfig.reference.name,
          ref: String(getRecordId(parsedResponse, selectedBlock)),
        });
      }

      return updatedRecordId;
    } else {
      navigate(ensureSegmentInUri(searchResultsUri), {
        state: { preserveStatusMessages: true } satisfies NavigationState,
      });
    }

    return updatedRecordId;
  };

  const handleRecordUpdate = async ({
    generatedRecord,
    recordId,
    updatedSelectedRecordBlocks,
    isNavigatingBack = true,
    asRefToNewRecord = false,
    shouldSetSearchParams = true,
    isProfileChange = false,
  }: HandleRecordUpdateProps) => {
    if (!generatedRecord) return;

    setIsLoading(true);

    try {
      const response = await saveRecordToApi(recordId, generatedRecord);
      const parsedResponse = await response.json();

      updateStateAfterSave(parsedResponse, asRefToNewRecord, recordId);

      const updatedRecordId = getRecordId(parsedResponse, updatedSelectedRecordBlocks?.block);
      setLastSavedRecordId(updatedRecordId);

      // Mark all other cached resources stale first (Instance↔Work cross-effects); refetchType: 'none'
      // prevents immediate background refetches — resources re-fetch on next ensureQueryData access
      await queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY], refetchType: 'none' });
      // Overwrite the saved entry with the authoritative server response (updatedAt = now, staleTime = Infinity)
      queryClient.setQueryData([RESOURCE_QUERY_KEY, updatedRecordId], parsedResponse);
      // Refresh any previews currently on screen so they reflect the updated resource
      await queryClient.invalidateQueries({ queryKey: ['preview'], refetchType: 'active' });

      // Handle different navigation scenarios
      if (isProfileChange || !isNavigatingBack) {
        return await handleProfileOrNoNavigationChange(updatedRecordId, parsedResponse, isProfileChange);
      }

      if (isNavigatingBack) {
        return handleBackNavigation(updatedRecordId, parsedResponse, asRefToNewRecord, shouldSetSearchParams);
      }

      return updatedRecordId;
    } catch (error) {
      logger.error('Cannot update the resource description', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, getFriendlyErrorMessage(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecord = async ({
    asRefToNewRecord = false,
    isNavigatingBack = true,
    shouldSetSearchParams = true,
    profileId,
  }: SaveRecordProps = {}) => {
    const generatedRecord = generateRecord({ profileId });
    const updatedSelectedRecordBlocks = selectedRecordBlocks || getSelectedRecordBlocks(searchParams);
    const recordId = getRecordId(record, updatedSelectedRecordBlocks?.block);

    return await handleRecordUpdate({
      generatedRecord,
      recordId,
      updatedSelectedRecordBlocks,
      isNavigatingBack,
      asRefToNewRecord,
      shouldSetSearchParams,
    });
  };

  const deleteRecord = async () => {
    try {
      if (!currentRecordId) return;

      await deleteRecordRequest(currentRecordId);
      queryClient.removeQueries({ queryKey: [RESOURCE_QUERY_KEY, currentRecordId] });
      // Invalidate cross-effect resources (e.g., a work whose instance was updated)
      await queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY], refetchType: 'none' });
      await queryClient.invalidateQueries({ queryKey: ['preview'], refetchType: 'active' });
      discardRecord();
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.success, 'ld.rdDeleted'));

      navigate(ROUTES.SEARCH.uri);
    } catch (error) {
      logger.error('Cannot delete the resource description', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantDeleteRd'));
    }
  };

  const changeRecordProfile = ({ profileId }: { profileId: string | number }) => {
    const generatedRecord = generateRecord({ profileId: `${profileId}` });
    const updatedSelectedRecordBlocks = selectedRecordBlocks || getSelectedRecordBlocks(searchParams);
    const recordId = getRecordId(record, updatedSelectedRecordBlocks?.block);

    return handleRecordUpdate({
      generatedRecord,
      recordId,
      updatedSelectedRecordBlocks,
      isNavigatingBack: false,
      isProfileChange: true,
    });
  };

  return { saveRecord, deleteRecord, changeRecordProfile };
};
