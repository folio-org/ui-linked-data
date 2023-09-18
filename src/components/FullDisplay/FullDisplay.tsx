import { useRecordControls } from '@common/hooks/useRecordControls';
import { Preview } from '@components/Preview';
import state from '@state';
import { useRecoilState } from 'recoil';
import './FullDisplay.scss';

export const FullDisplay = () => {
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
  const { fetchRecord } = useRecordControls();

  return (
    <div className="full-display-container">
      {Object.entries(previewContent).map(([key, { base, userValues, initKey }]) => (
        <div key={key}>
          <div className="full-display-controls">
            <button data-testid="preview-fetch" onClick={() => fetchRecord(key)}>
              ✏️
            </button>
            <button
              data-testid="preview-remove"
              onClick={() => {
                const { [key]: _, ...withoutKey } = previewContent;
                setPreviewContent(withoutKey);
              }}
            >
              ❌
            </button>
          </div>
          {Object.keys(userValues).length ? (
            <Preview altSchema={base} altUserValues={userValues} altInitKey={initKey} headless />
          ) : (
            <div>Resource description {key} is empty</div>
          )}
        </div>
      ))}
    </div>
  );
};
