import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { applyUserValues } from '@common/helpers/profile.helper';
import { postRecord, putRecord, deleteRecord as deleteRecordRequest } from '@common/api/records.api';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { StatusType } from '@common/constants/status.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import {
  deleteRecordLocally,
  getPrimaryEntitiesFromRecord,
  getRecordId,
  saveRecordLocally,
} from '@common/helpers/record.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useConfig as useConfigLegacy } from '@common/hooks/useConfig_OLD.hook';
import { useConfig } from '@common/hooks/useConfig.hook';
import { getSavedRecord } from '@common/helpers/record.helper';
import { formatRecord } from '@common/helpers/recordFormatting.helper';
import { getRecord } from '@common/api/records.api';
import { ROUTES } from '@common/constants/routes.constants';
import state from '@state';
import { IS_NEW_SCHEMA_BUILDING_ALGORITHM_ENABLED } from '@common/constants/feature.constants';

export const useRecordControls = () => {
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const schema = useRecoilValue(state.config.schema);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const selectedEntries = useRecoilValue(state.config.selectedEntries);
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);
  const [record, setRecord] = useRecoilState(state.inputs.record);
  const setIsEdited = useSetRecoilState(state.status.recordIsEdited);
  const [isInitiallyLoaded, setIsInititallyLoaded] = useRecoilState(state.status.recordIsInititallyLoaded);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const setCurrentlyEditedEntityBfid = useSetRecoilState(state.ui.currentlyEditedEntityBfid);
  const setCurrentlyPreviewedEntityBfid = useSetRecoilState(state.ui.currentlyPreviewedEntityBfid);
  const profile = PROFILE_BFIDS.MONOGRAPH;
  const currentRecordId = getRecordId(record);
  const useConfigHook = IS_NEW_SCHEMA_BUILDING_ALGORITHM_ENABLED ? useConfig : useConfigLegacy;
  const { getProfiles } = useConfigHook();
  const navigate = useNavigate();

  const fetchRecord = async (recordId: string, asPreview = false) => {
    try {
      const profile = PROFILE_BFIDS.MONOGRAPH;
      const locallySavedData = getSavedRecord(profile, recordId);
      const recordData: RecordEntry =
        locallySavedData && !asPreview ? locallySavedData.data : await getRecord({ recordId });

      setCurrentlyEditedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData)));
      setCurrentlyPreviewedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData, false)));

      setRecord(recordData);
      await getProfiles({ record: recordData, recordId, asPreview });
    } catch (_err) {
      console.error('Error fetching record.');

      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.errorFetching'),
      ]);
    }
  };

  const saveRecord = async () => {
    const parsed = applyUserValues(schema, initialSchemaKey, { selectedEntries, userValues });
    const currentRecordId = record?.id;

    if (!parsed) return;

    setIsLoading(true);

    try {
      const formattedRecord = formatRecord(parsed) as RecordEntry;
      // TODO: define a type
      const recordId = getRecordId(record);
      const response =
        !recordId || getRecordId(record) === DEFAULT_RECORD_ID
          ? await postRecord(formattedRecord)
          : await putRecord(recordId as string, formattedRecord);
      const parsedResponse = await response.json();

      deleteRecordLocally(profile, currentRecordId as RecordID);
      setIsEdited(false);
      if (isInitiallyLoaded) {
        setIsInititallyLoaded(false);
      }
      setRecord(parsedResponse);
      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.success, 'marva.rdSaveSuccess'),
      ]);
    } catch (error) {
      console.error('Cannot save the resource description', error);

      setCommonStatus(currentStatus => [
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

    return saveRecordLocally(profile, parsed, getRecordId(record) as string);
  };

  const clearRecordState = () => {
    setUserValues({});
    setRecord(null);
    setSelectedProfile(null);
  };

  const discardRecord = () => {
    clearRecordState();
    navigate(ROUTES.DASHBOARD.uri);
  };

  const deleteRecord = async () => {
    try {
      if (!currentRecordId) return;

      await deleteRecordRequest(currentRecordId as unknown as string);
      deleteRecordLocally(profile, currentRecordId as unknown as string);
      discardRecord();
      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.success, 'marva.rdDeleted'),
      ]);

      navigate(ROUTES.DASHBOARD.uri);
    } catch (error) {
      console.error('Cannot delete the resource description', error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.cantDeleteRd'),
      ]);
    }
  };

  return { fetchRecord, saveRecord, saveLocalRecord, deleteRecord, discardRecord, clearRecordState };
};
