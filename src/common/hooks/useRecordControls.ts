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
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);
  const [record, setRecord] = useRecoilState(state.inputs.record);
  const setIsEdited = useSetRecoilState(state.status.recordIsEdited);
  const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
  const currentRecordId = record?.id;

  const { getProfiles } = useConfig();
  const navigate = useNavigate();

  const fetchRecord = async (recordId: string) => {
    try {
      const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
      const locallySavedData = getSavedRecord(profile, recordId);
      const recordData: RecordEntry = locallySavedData
        ? { id: recordId, profile, ...locallySavedData.data[profile] }
        : await getRecord({ recordId });

      setRecord(recordData);
      getProfiles(recordData);

      navigate(ROUTES.EDIT.uri);
    } catch (err) {
      console.error('Error fetching record: ', err);
    }
  };

  const saveRecord = async () => {
    const parsed = applyUserValues(schema, userValues, initialSchemaKey);
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
      const updatedRecord = { ...record, id: parsedResponse?.id } as RecordEntry;

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
