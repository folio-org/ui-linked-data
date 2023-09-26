import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { applyUserValues } from '@common/helpers/profile.helper';
import { postRecord, putRecord, deleteRecord as deleteRecordRequest } from '@common/api/records.api';
import { PROFILE_IDS } from '@common/constants/bibframe.constants';
import { StatusType } from '@common/constants/status.constants';
import state from '@state';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { deleteRecordLocally, formatRecord } from '@common/helpers/record.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useConfig } from '@common/hooks/useConfig.hook';
import { getSavedRecord } from '@common/helpers/record.helper';
import { getRecord } from '@common/api/records.api';
import { ROUTES } from '@common/constants/routes.constants';

export const useRecordControls = () => {
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const schema = useRecoilValue(state.config.schema);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const selectedEntries = useRecoilValue(state.config.selectedEntries);
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);
  const [record, setRecord] = useRecoilState(state.inputs.record);
  const setIsEdited = useSetRecoilState(state.status.recordIsEdited);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
  const currentRecordId = record?.id;

  const { getProfiles } = useConfig();
  const navigate = useNavigate();

  const fetchRecord = async (recordId: string, asPreview = false) => {
    try {
      const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
      const locallySavedData = getSavedRecord(profile, recordId);
      const recordData: RecordEntryDeprecated =
        locallySavedData && !asPreview
          ? { id: recordId, profile, ...locallySavedData.data[profile] }
          : await getRecord({ recordId });

      setRecord(recordData);
      getProfiles({ record: recordData, recordId, asPreview });

      !asPreview && navigate(ROUTES.EDIT.uri);
    } catch (_err) {
      console.error('Error fetching record.');

      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.search-error-fetching'),
      ]);
    }
  };

  const saveRecord = async () => {
    const parsed = applyUserValues(schema, initialSchemaKey, { selectedEntries, userValues });
    const currentRecordId = record?.id;

    if (!parsed) return;

    try {
      const formattedRecord = formatRecord(profile, parsed);
      // TODO: define a type
      const response: any =
        !record?.id || record.id === DEFAULT_RECORD_ID
          ? await postRecord(formattedRecord)
          : await putRecord(record.id, formattedRecord);
      const parsedResponse = await response.json();
      const updatedRecord = { ...record, id: parsedResponse?.id } as RecordEntryDeprecated;

      deleteRecordLocally(profile, currentRecordId);
      setIsEdited(false);
      setRecord(updatedRecord);
      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.success, 'marva.rd-save-success'),
      ]);
    } catch (error) {
      console.error('Cannot save the resource description', error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.cant-save-rd'),
      ]);
    }
  };

  const discardRecord = () => {
    setUserValues({});
    setRecord(null);
    setSelectedProfile(null);
  };

  const deleteRecord = async () => {
    try {
      if (!currentRecordId) return;

      await deleteRecordRequest(currentRecordId);
      deleteRecordLocally(profile, currentRecordId);
      discardRecord();
      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.success, 'marva.rd-deleted'),
      ]);

      navigate(ROUTES.LOAD.uri);
    } catch (error) {
      console.error('Cannot delete the resource description', error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.cant-delete-rd'),
      ]);
    }
  };

  return { fetchRecord, saveRecord, deleteRecord, discardRecord };
};
