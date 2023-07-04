import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import state from '../../state/state';
import { getTransformedPreviewComponents, getSortedPreviewBlocks } from '../../common/helpers/preview.helper';
import './Preview.scss';
import { applyUserValues } from '../../common/helpers/profile.helper';
import { postRecord } from '../../common/api/records.api';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';
import { generateRecordBackupKey } from '../../common/helpers/progressBackup.helper';
import { localStorageService } from '../../common/services/storage';

export const Preview = () => {
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const normalizedFields = useRecoilValue(state.config.normalizedFields);
  const [record, setRecord] = useRecoilState(state.inputs.record);

  const onClickSaveRecord = async () => {
    const profile = record?.profile ?? PROFILE_IDS.MONOGRAPH;
    const parsed = await applyUserValues(normalizedFields, userValues);

    // TODO: save a new record or update the existing one
    await formatAndPostRecord(profile, parsed);
    saveRecordLocally(profile, parsed);
  };

  const formatAndPostRecord = async (profile: any, parsedRecord: Record<string, object>) => {
    const result = {
      ...parsedRecord,
      profile,
      id: record?.id ?? Math.ceil(Math.random() * 100000),
    };

    postRecord(result);
  };

  const saveRecordLocally = (profile: string, parsedRecord: Record<string, object>) => {
    // TODO: check id of the created record in response and use it for key generation
    const storageKey = generateRecordBackupKey(profile, record?.id);

    localStorageService.serialize(storageKey, parsedRecord);
  };

  const discardRecord = () => {
    setUserValues([]);
    setRecord(null);
    setSelectedProfile(null);
  };

  const componentsTree = getTransformedPreviewComponents(userValues);
  const sortedPreviewComponents = getSortedPreviewBlocks(Array.from(componentsTree?.values()));

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
      <button onClick={onClickSaveRecord}>Post Record</button>
      <button onClick={discardRecord}>Discard Record</button>
    </div>
  );
};
