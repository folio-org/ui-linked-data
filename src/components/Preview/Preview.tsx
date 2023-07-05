import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import state from '../../state/state';
import { getTransformedPreviewComponents, getSortedPreviewBlocks } from '../../common/helpers/preview.helper';
import './Preview.scss';
import { applyUserValues } from '../../common/helpers/profile.helper';
import { postRecord, putRecord } from '../../common/api/records.api';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';
import { generateRecordBackupKey } from '../../common/helpers/progressBackup.helper';
import { localStorageService } from '../../common/services/storage';

export const Preview = () => {
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const normalizedFields = useRecoilValue(state.config.normalizedFields);
  const [record, setRecord] = useRecoilState(state.inputs.record);
  const [errors, setError] = useState<Record<string, string | null>>({});

  const onClickSaveRecord = async () => {
    const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
    const parsed = applyUserValues(normalizedFields, userValues);
    // TODO: define a type
    let response: any;

    try {
      const formattedRecord = formatRecord(profile, parsed);

      if (!record?.id) {
        // TODO: check if API provides an id
        response = await postRecord(formattedRecord);
      } else {
        await putRecord(record.id, formattedRecord);
      }

      setError(oldValue => ({ ...oldValue, saveRecord: null }));
    } catch (error) {
      const message = 'Cannot save the record';
      console.error(message, error);

      setError(oldValue => ({ ...oldValue, saveRecord: message }));
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
    setUserValues([]);
    setRecord(null);
    setSelectedProfile(null);
  };

  const componentsTree = getTransformedPreviewComponents(userValues);
  const sortedPreviewComponents = getSortedPreviewBlocks(Array.from(componentsTree?.values()));
  const errrorsList = Object.values(errors)?.filter(errorMessage => errorMessage);

  return (
    <div className="preview-panel">
      <strong>Preview pane</strong>
      {sortedPreviewComponents.map(({ title: blockTitle, groups }: PreviewBlock) => (
        <div key={blockTitle}>
          <h3>{blockTitle}</h3>
          {Array.from<PreviewGroup>(groups.values()).map(({ title: groupTitle, value }) => (
            <div key={`${groupTitle}`} className="preview-block">
              <strong>{groupTitle}</strong>
              {value?.map(({ uri, label, field }) =>
                uri ? (
                  <div key={uri}>
                    <a href={uri} target="__blank">
                      {label}
                    </a>
                  </div>
                ) : (
                  <div key={field}>{label}</div>
                ),
              )}
            </div>
          ))}
        </div>
      ))}
      <br />

      <div>
        <div>
          <button onClick={onClickSaveRecord}>Post Record</button>
          <button onClick={discardRecord}>Discard Record</button>
        </div>

        {errrorsList?.length > 0 && (
          <ul>
            {errrorsList.map(errorMessage => (
              <li key={errorMessage}>Error: {errorMessage}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
