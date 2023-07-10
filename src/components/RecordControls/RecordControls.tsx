import { memo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import { applyUserValues } from '../../common/helpers/profile.helper';
import { postRecord, putRecord } from '../../common/api/records.api';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';
import { generateRecordBackupKey } from '../../common/helpers/progressBackup.helper';
import { localStorageService } from '../../common/services/storage';
import { StatusType } from '../../common/constants/status.constants';
import state from '../../state/state';
import './RecordControls.scss';
import { ModalCloseRecord } from '../ModalCloseRecord/ModalCloseRecord';

export const RecordControls = memo(() => {
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const schema = useRecoilValue(state.config.schema);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const [record, setRecord] = useRecoilState(state.inputs.record);
  const [status, setStatus] = useState<StatusEntry | null>(null);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const saveRecord = async () => {
    const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
    const parsed = applyUserValues(schema, userValues, initialSchemaKey);
    // TODO: define a type
    let response: any;

    if (!parsed) return;

    try {
      const formattedRecord = formatRecord(profile, parsed);

      if (!record?.id) {
        // TODO: check if API provides an id
        response = await postRecord(formattedRecord);
      } else {
        await putRecord(record.id, formattedRecord);
      }

      setStatus({ type: StatusType.success, message: 'Record saved successfully' });
    } catch (error) {
      const message = 'Cannot save the record';
      console.error(message, error);

      setStatus({ type: StatusType.error, message });
    }

    const recordId = record?.id || response?.id;

    saveRecordLocally(profile, parsed, recordId);
  };

  const formatRecord = (profile: any, parsedRecord: Record<string, object>) => {
    const formattedRecord: RecordEntry = {
      ...parsedRecord,
      profile,
    };

    if (record?.id) {
      formattedRecord.id = record?.id;
    }

    return formattedRecord;
  };

  const saveRecordLocally = (profile: string, parsedRecord: Record<string, object>, recordId: number) => {
    const storageKey = generateRecordBackupKey(profile, recordId);

    localStorageService.serialize(storageKey, parsedRecord);
  };

  const discardRecord = () => {
    setUserValues({});
    setRecord(null);
    setSelectedProfile(null);
  };

  const onClickCloseButton = () => {
    setIsCloseModalOpen(true);
  };

  return (
    <div>
      <div>
        <button onClick={saveRecord}>Post Record</button>
        <button onClick={onClickCloseButton}>Discard Record</button>
      </div>
      {status && <p className={classNames(['status-message', status.type])}>{status.message}</p>}
      <ModalCloseRecord
        isOpen={isCloseModalOpen}
        toggleIsOpen={setIsCloseModalOpen}
        saveRecord={saveRecord}
        discardRecord={discardRecord}
      />
    </div>
  );
});
