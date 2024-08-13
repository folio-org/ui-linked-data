import { flushSync } from 'react-dom';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { applyUserValues } from '@common/helpers/profile.helper';
import { postRecord, putRecord, deleteRecord as deleteRecordRequest } from '@common/api/records.api';
import { BibframeEntities, PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { StatusType } from '@common/constants/status.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import {
  deleteRecordLocally,
  getPrimaryEntitiesFromRecord,
  getRecordId,
  getSelectedRecordBlocks,
  saveRecordLocally,
} from '@common/helpers/record.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { PreviewParams, useConfig } from '@common/hooks/useConfig.hook';
import { getSavedRecord } from '@common/helpers/record.helper';
import { formatRecord } from '@common/helpers/recordFormatting.helper';
import { getRecord } from '@common/api/records.api';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';
import { BLOCKS_BFLITE } from '@common/constants/bibframeMapping.constants';
import { RecordStatus, ResourceType } from '@common/constants/record.constants';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { useBackToSearchUri } from './useBackToSearchUri';
import state from '@state';

type SaveRecordProps = {
  asRefToNewRecord?: boolean;
  shouldSetSearchParams?: boolean;
  isNavigatingBack?: boolean;
};

export const useRecordControls = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const schema = useRecoilValue(state.config.schema);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const selectedEntries = useRecoilValue(state.config.selectedEntries);
  const [record, setRecord] = useRecoilState(state.inputs.record);
  const setIsEdited = useSetRecoilState(state.status.recordIsEdited);
  const setRecordStatus = useSetRecoilState(state.status.recordStatus);
  const [isInitiallyLoaded, setIsInitiallyLoaded] = useRecoilState(state.status.recordIsInitiallyLoaded);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const setCurrentlyEditedEntityBfid = useSetRecoilState(state.ui.currentlyEditedEntityBfid);
  const setCurrentlyPreviewedEntityBfid = useSetRecoilState(state.ui.currentlyPreviewedEntityBfid);
  const [selectedRecordBlocks, setSelectedRecordBlocks] = useRecoilState(state.inputs.selectedRecordBlocks);
  const profile = PROFILE_BFIDS.MONOGRAPH;
  const currentRecordId = getRecordId(record);
  const { getProfiles } = useConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const searchResultsUri = useBackToSearchUri();

  const fetchRecord = async (recordId: string, previewParams?: PreviewParams) => {
    try {
      const profile = PROFILE_BFIDS.MONOGRAPH;
      const locallySavedData = getSavedRecord(profile, recordId);
      const recordData: RecordEntry =
        locallySavedData && !previewParams ? locallySavedData.data : await getRecord({ recordId });

      if (!previewParams) {
        setCurrentlyEditedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData)));
        setRecord(recordData);
      }

      setCurrentlyPreviewedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData, !!previewParams)));

      await getProfiles({ record: recordData, recordId, previewParams });
    } catch (_err) {
      console.error('Error fetching record.');

      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.errorFetching'),
      ]);
    }
  };

  const saveRecord = async ({
    asRefToNewRecord = false,
    isNavigatingBack = true,
    shouldSetSearchParams = true,
  }: SaveRecordProps = {}) => {
    const parsed = applyUserValues(schema, initialSchemaKey, { selectedEntries, userValues });
    const currentRecordId = record?.id;

    if (!parsed) return;

    setIsLoading(true);

    try {
      const updatedSelectedRecordBlocks = selectedRecordBlocks || getSelectedRecordBlocks(searchParams);
      const formattedRecord = formatRecord({
        parsedRecord: parsed,
        record,
        selectedRecordBlocks: updatedSelectedRecordBlocks,
      }) as RecordEntry;

      // TODO: define a type
      const recordId = getRecordId(record, selectedRecordBlocks?.block);

      const response =
        !recordId || getRecordId(record) === DEFAULT_RECORD_ID
          ? await postRecord(formattedRecord)
          : await putRecord(recordId as string, formattedRecord);
      const parsedResponse = await response.json();

      deleteRecordLocally(profile, currentRecordId as RecordID);

      if (isInitiallyLoaded) {
        setIsInitiallyLoaded(false);
      }

      !asRefToNewRecord && setRecord(parsedResponse);

      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(
          StatusType.success,
          recordId ? 'marva.rdUpdateSuccess' : 'marva.rdSaveSuccess',
        ),
      ]);

      // TODO: isEdited state update is not immediately reflected in the <Prompt />
      // blocker component, forcing <Prompt /> to block the navigation call below
      // right before isEdited is set to false, disabling <Prompt />
      //
      // flushSync is not the best way to make this work, research alternatives
      flushSync(() => setIsEdited(false));

      const updatedRecordId = getRecordId(parsedResponse, updatedSelectedRecordBlocks?.block);

      if (!isNavigatingBack) {
        navigate(generateEditResourceUrl(updatedRecordId as string), {
          replace: true,
          state: location.state,
        });

        setRecordStatus({ type: RecordStatus.saveAndKeepEditing });

        return;
      }

      setRecordStatus({ type: RecordStatus.saveAndClose });

      if (asRefToNewRecord) {
        const blocksBfliteKey = (
          searchParams.get(QueryParams.Type) || ResourceType.instance
        )?.toUpperCase() as BibframeEntities;

        const selectedBlock = BLOCKS_BFLITE[blocksBfliteKey]?.uri;

        shouldSetSearchParams &&
          setSearchParams({
            type: BLOCKS_BFLITE[blocksBfliteKey]?.reference?.name,
            ref: String(getRecordId(parsedResponse, selectedBlock)),
          });

        return updatedRecordId;
      } else {
        navigate(searchResultsUri);
      }
    } catch (error) {
      console.error('Cannot save the resource description', error);

      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.cantSaveRd'),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLocalRecord = () => {
    const parsed = applyUserValues(schema, initialSchemaKey, { userValues, selectedEntries });

    if (!parsed) return;

    return saveRecordLocally({ profile, parsedRecord: parsed, record, selectedRecordBlocks });
  };

  const clearRecordState = () => {
    setUserValues({});
    setRecord(null);
    setSelectedRecordBlocks(undefined);
    setSelectedProfile(null);
    setRecordStatus({ type: RecordStatus.close });
  };

  const discardRecord = (clearState = true) => {
    if (clearState) clearRecordState();

    navigate(searchResultsUri);
  };

  const deleteRecord = async () => {
    try {
      if (!currentRecordId) return;

      await deleteRecordRequest(currentRecordId as unknown as string);
      deleteRecordLocally(profile, currentRecordId as unknown as string);
      discardRecord();
      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.success, 'marva.rdDeleted'),
      ]);

      navigate(ROUTES.SEARCH.uri);
    } catch (error) {
      console.error('Cannot delete the resource description', error);

      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.cantDeleteRd'),
      ]);
    }
  };

  const fetchRecordAndSelectEntityValues = async (recordId: string, entityId: BibframeEntities) => {
    try {
      const record = await getRecord({ recordId });
      const uriSelector = BLOCKS_BFLITE[entityId]?.reference?.uri;
      const contents = record?.resource?.[uriSelector];

      if (!contents) {
        setStatusMessages(currentStatus => [
          ...currentStatus,
          UserNotificationFactory.createMessage(StatusType.error, 'marva.cantSelectReferenceContents'),
        ]);

        return navigate(ROUTES.RESOURCE_CREATE.uri);
      }

      const selectedContents = {
        ...contents,
        [BLOCKS_BFLITE[entityId]?.reference?.key]: undefined,
      };

      return {
        resource: {
          [BLOCKS_BFLITE[entityId]?.uri]: {
            [BLOCKS_BFLITE[entityId]?.reference?.key]: [selectedContents],
          },
        },
      };
    } catch (e) {
      console.error('Error fetching record and selecting entity values: ', e);

      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.errorFetching'),
      ]);
    }
  };

  return {
    fetchRecord,
    saveRecord,
    saveLocalRecord,
    deleteRecord,
    discardRecord,
    clearRecordState,
    fetchRecordAndSelectEntityValues,
  };
};
