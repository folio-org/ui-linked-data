import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { applyUserValues } from '../../common/helpers/profile.helper';
import { postRecord, putRecord, deleteRecord as deleteRecordRequest } from '../../common/api/records.api';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';
import { StatusType } from '../../common/constants/status.constants';
import state from '../../state/state';
import { DEFAULT_RECORD_ID } from '../../common/constants/storage.constants';
import { deleteRecordLocally, formatRecord } from '../../common/helpers/record.helper';
import UserNotificationFactory from '../services/userNotification/userNotification.factory';

export const useRecordControls = () => {
  const history = useHistory();
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const schema = useRecoilValue(state.config.schema);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);
  const [record, setRecord] = useRecoilState(state.inputs.record);
  const setIsEdited = useSetRecoilState(state.status.recordIsEdited);
  const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
  const currentRecordId = record?.id;

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
        UserNotificationFactory.createMessage(StatusType.success, 'Record saved successfully'),
      ]);
    } catch (error) {
      const message = 'Cannot save the record';
      console.error(message, error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, message),
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
        UserNotificationFactory.createMessage(StatusType.success, 'Resource description deleted'),
      ]);

      history.replace('/load');
    } catch (error) {
      const message = 'Cannot delete the record';
      console.error(message, error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, message),
      ]);
    }
  };

  return { saveRecord, deleteRecord, discardRecord };
};
