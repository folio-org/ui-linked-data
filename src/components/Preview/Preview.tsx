import { useRecoilValue } from 'recoil';
import state from '../../state/state';
import { getTransformedPreviewComponents, getSortedPreviewBlocks } from '../../common/helpers/preview.helper';
import './Preview.scss';
import { RecordControls } from '../RecordControls/RecordControls';

export const Preview = () => {
  const userValues = useRecoilValue(state.inputs.userValues);
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

      <RecordControls />
    </div>
  );
};
