import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import state from '../../state/state';
import './Preview.scss';
import { applyUserValues } from '../../common/helpers/profile.helper';
import { postRecord, putRecord } from '../../common/api/records.api';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';
import { generateRecordBackupKey } from '../../common/helpers/progressBackup.helper';
import { localStorageService } from '../../common/services/storage';
import { StatusType } from '../../common/constants/status.constants';
import { AdvancedFieldType } from '../../common/constants/uiControls.constants';

export const Preview = () => {
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const schema = useRecoilValue(state.config.schema);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const record = useRecoilValue(state.inputs.record);
  const [status, setStatus] = useState<StatusEntry | undefined>();
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey)

  const onClickSaveRecord = async () => {
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
    setSelectedProfile(null);
  };

  type Fields = {
    schema: Map<string, SchemaEntry>;
    uuid: string | null;
    level?: number;
    paths: Array<string>,
  }

  // TODO: potentially reuse <Fields /> from EditSection ?
  const Fields = ({
    schema,
    uuid,
    paths,
    level = 0
  }: Fields) => {
    if (!uuid || !paths?.includes(uuid)) return null;

    const { displayName, children, type } = schema.get(uuid) || {}

    return (
      <div className={classNames({ 'preview-block': level === 2 })}>
        {
          type !== AdvancedFieldType.profile && type !== AdvancedFieldType.hidden && <strong>{displayName}</strong>
        }
        {
          children?.map((uuid: string) => <Fields key={uuid} uuid={uuid} schema={schema} paths={paths} level={level + 1} />)
        }
        {
          !children && userValues[uuid]?.contents?.map(({ label, meta: { uri, parentUri } = {} }) => (
            <div key={`${label}${uri}`}>
              <div>
                {
                  uri || parentUri ? <a href={uri || parentUri}>{label}</a> : label
                }
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <div className="preview-panel">
      <Fields schema={schema} uuid={initialSchemaKey} paths={Object.keys(userValues).map((key) => schema.get(key)?.path).flat()} />
      <br />

      <div>
        <div>
          <button onClick={onClickSaveRecord}>Post Record</button>
          <button onClick={discardRecord}>Discard Record</button>
        </div>

        {status && <p className={classNames(['status-message', status.type])}>{status.message}</p>}
      </div>
    </div>
  );
};
