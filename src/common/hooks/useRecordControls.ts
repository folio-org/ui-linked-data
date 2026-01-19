import { flushSync } from 'react-dom';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  postRecord,
  putRecord,
  deleteRecord as deleteRecordRequest,
  getGraphIdByExternalId,
  getRecord,
} from '@common/api/records.api';
import { BibframeEntities } from '@common/constants/bibframe.constants';
import { StatusType } from '@common/constants/status.constants';
import { getPrimaryEntitiesFromRecord, getRecordId, getSelectedRecordBlocks } from '@common/helpers/record.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { PreviewParams, useConfig } from '@common/hooks/useConfig.hook';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';
import { BLOCKS_BFLITE } from '@common/constants/bibframeMapping.constants';
import { RecordStatus, ResourceType } from '@common/constants/record.constants';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { ExternalResourceIdType } from '@common/constants/api.constants';
import { getFriendlyErrorMessage } from '@common/helpers/api.helper';
import { useLoadingState, useStatusState, useProfileState, useInputsState, useUIState } from '@src/store';
import { useRecordGeneration } from './useRecordGeneration';
import { useBackToSearchUri } from './useBackToSearchUri';
import { useContainerEvents } from './useContainerEvents';

type SaveRecordProps = {
  asRefToNewRecord?: boolean;
  shouldSetSearchParams?: boolean;
  isNavigatingBack?: boolean;
  profileId?: string;
};

type IBaseFetchRecord = {
  recordId?: string;
  cachedRecord?: RecordEntry;
  idType?: ExternalResourceIdType;
  errorMessage?: string;
  previewParams?: PreviewParams;
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

export const useRecordControls = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { resetUserValues, selectedRecordBlocks, setSelectedRecordBlocks, record, setRecord } = useInputsState([
    'resetUserValues',
    'selectedRecordBlocks',
    'setSelectedRecordBlocks',
    'record',
    'setRecord',
  ]);
  const { setSelectedProfile } = useProfileState(['setSelectedProfile']);
  const { setCurrentlyEditedEntityBfid, setCurrentlyPreviewedEntityBfid } = useUIState([
    'setCurrentlyEditedEntityBfid',
    'setCurrentlyPreviewedEntityBfid',
  ]);
  const {
    setRecordStatus,
    setLastSavedRecordId,
    setIsRecordEdited: setIsEdited,
    addStatusMessagesItem,
  } = useStatusState(['setRecordStatus', 'setLastSavedRecordId', 'setIsRecordEdited', 'addStatusMessagesItem']);
  const currentRecordId = getRecordId(record);
  const { getProfiles } = useConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const searchResultsUri = useBackToSearchUri();
  const { dispatchUnblockEvent, dispatchNavigateToOriginEventWithFallback } = useContainerEvents();
  const [queryParams] = useSearchParams();
  const isClone = queryParams.get(QueryParams.CloneOf);
  const { generateRecord } = useRecordGeneration();

  const fetchRecord = async (recordId: string, previewParams?: PreviewParams) => {
    const recordData = await getRecordAndInitializeParsing({ recordId });

    if (!recordData) return;

    if (!previewParams) {
      setCurrentlyEditedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData)));
      setRecord(recordData);
    }

    setCurrentlyPreviewedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData, !!previewParams)));

    await getProfiles({
      record: recordData,
      recordId,
      previewParams,
      asClone: Boolean(isClone),
    });

    setIsEdited(false);
  };

  // Helper functions to reduce cognitive complexity in handleRecordUpdate
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
      state: location.state,
    });

    if (isProfileChange) {
      await getProfiles({
        record: parsedResponse,
      });
    } else {
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
      navigate(searchResultsUri);
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

      // Handle different navigation scenarios
      if (isProfileChange || !isNavigatingBack) {
        return await handleProfileOrNoNavigationChange(updatedRecordId, parsedResponse, isProfileChange);
      }

      if (isNavigatingBack) {
        return handleBackNavigation(updatedRecordId, parsedResponse, asRefToNewRecord, shouldSetSearchParams);
      }

      return updatedRecordId;
    } catch (error) {
      console.error('Cannot update the resource description', error);
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

  const clearRecordState = () => {
    resetUserValues();
    setRecord(null);
    setSelectedRecordBlocks(undefined);
    setSelectedProfile(null);
    setRecordStatus({ type: RecordStatus.close });
    dispatchUnblockEvent();
  };

  const discardRecord = (clearState = true) => {
    if (clearState) clearRecordState();

    dispatchNavigateToOriginEventWithFallback(searchResultsUri);
  };

  const deleteRecord = async () => {
    try {
      if (!currentRecordId) return;

      await deleteRecordRequest(currentRecordId as unknown as string);
      discardRecord();
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.success, 'ld.rdDeleted'));

      navigate(ROUTES.SEARCH.uri);
    } catch (error) {
      console.error('Cannot delete the resource description', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantDeleteRd'));
    }
  };

  const fetchRecordAndSelectEntityValues = async (recordId: string, entityId: BibframeEntities) => {
    try {
      const record = await getRecord({ recordId });
      const blockConfig = BLOCKS_BFLITE[entityId];

      // If this entity type doesn't have a reference (like Hub), return early
      if (!blockConfig?.reference) {
        return { resource: record?.resource };
      }

      const uriSelector = blockConfig.reference.uri;
      const contents = record?.resource?.[uriSelector];

      if (!contents) {
        addStatusMessagesItem?.(
          UserNotificationFactory.createMessage(StatusType.error, 'ld.cantSelectReferenceContents'),
        );

        return navigate(ROUTES.RESOURCE_CREATE.uri);
      }

      const selectedContents = {
        ...contents,
        [blockConfig.reference.key]: undefined,
      };

      return {
        resource: {
          [blockConfig.uri]: {
            [blockConfig.reference.key]: [selectedContents],
          },
        },
      };
    } catch (e) {
      console.error('Error fetching record and selecting entity values: ', e);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    }
  };

  const getRecordAndInitializeParsing = async ({
    recordId,
    cachedRecord,
    idType,
    previewParams,
    errorMessage,
  }: IBaseFetchRecord) => {
    if (!recordId && !cachedRecord) return;

    try {
      const recordData: RecordEntry = cachedRecord ?? (recordId && (await getRecord({ recordId, idType })));

      await getProfiles({
        record: recordData,
        recordId,
        previewParams,
      });

      return recordData;
    } catch (err) {
      console.error('Error initializing record parsing:', err);
      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, errorMessage ?? 'ld.errorFetching'),
      );
    }
  };

  const fetchExternalRecordForPreview = async (recordId?: string, idType = ExternalResourceIdType.Inventory) => {
    if (!recordId) return;

    setIsLoading(true);

    await getRecordAndInitializeParsing({
      recordId,
      idType,
      errorMessage: 'ld.errorFetchingExternalResourceForPreview',
    });

    setIsLoading(false);
  };

  const tryFetchExternalRecordForEdit = async (recordId?: string) => {
    try {
      if (!recordId) return;

      setIsLoading(true);

      const { id } = await getGraphIdByExternalId({ recordId });

      if (id) {
        navigate(generateEditResourceUrl(id), { replace: true });
      }
    } catch (err: unknown) {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, getFriendlyErrorMessage(err)));
    } finally {
      setIsLoading(false);
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

  return {
    fetchRecord,
    saveRecord,
    deleteRecord,
    discardRecord,
    clearRecordState,
    fetchRecordAndSelectEntityValues,
    fetchExternalRecordForPreview,
    tryFetchExternalRecordForEdit,
    getRecordAndInitializeParsing,
    changeRecordProfile,
  };
};
