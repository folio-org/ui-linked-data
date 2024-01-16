import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { applyUserValues } from '@common/helpers/profile.helper';
import { postRecord, putRecord, deleteRecord as deleteRecordRequest } from '@common/api/records.api';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { StatusType } from '@common/constants/status.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { deleteRecordLocally, formatRecord, getRecordId } from '@common/helpers/record.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useConfig } from '@common/hooks/useConfig.hook';
import { getSavedRecord } from '@common/helpers/record.helper';
import { getRecord } from '@common/api/records.api';
import { ROUTES } from '@common/constants/routes.constants';
import state from '@state';

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
  const profile = PROFILE_BFIDS.MONOGRAPH;
  const currentRecordId = getRecordId(record);

  const { getProfiles } = useConfig();
  const navigate = useNavigate();

  const fetchRecord = async (recordId: string, asPreview = false) => {
    try {
      const profile = PROFILE_BFIDS.MONOGRAPH;
      const locallySavedData = getSavedRecord(profile, recordId);
      const recordData: RecordEntry =
        locallySavedData && !asPreview ? locallySavedData.data : await getRecord({ recordId });

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

  return { fetchRecord, saveRecord, deleteRecord, discardRecord, clearRecordState };
};
