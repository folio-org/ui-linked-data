import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import state from '../../state/state';
import { getTransformedPreviewComponents, getSortedPreviewBlocks } from '../../common/helpers/preview.helper';
import './Preview.scss';
import { applyUserValues } from '../../common/helpers/profile.helper';
import { postRecord } from '../../common/api/records.api';
import { PROFILE_IDS } from '../../common/constants/bibframe.constants';

export const Preview = () => {
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const normalizedFields = useRecoilValue(state.config.normalizedFields);
  const [record, setRecord] = useRecoilState(state.inputs.record);

  const formatAndPostRecord = async () => {
    const parsed = await applyUserValues(normalizedFields, userValues);
    const result = {
      ...parsed,
      profile: record?.profile ?? PROFILE_IDS.MONOGRAPH,
      id: record?.id ?? Math.ceil(Math.random() * 100000),
    };

    postRecord(result);
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
      <button onClick={formatAndPostRecord}>Post Record</button>
      <button onClick={discardRecord}>Discard Record</button>
    </div>
  );
};
