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
      {previewContent.map(({ id, base, userValues, initKey }) => (
        <div key={id}>
          <div className="full-display-controls">
            <button data-testid="preview-fetch" onClick={() => fetchRecord(id)}>
              ✏️
            </button>
            <button
              data-testid="preview-remove"
              onClick={() => setPreviewContent(previewContent.filter(entry => entry.id !== id))}
            >
              ❌
            </button>
          </div>
          {Object.keys(userValues).length ? (
            <Preview altSchema={base} altUserValues={userValues} altInitKey={initKey} headless />
          ) : (
            <div>Resource description {id} is empty</div>
          )}
        </div>
      ))}
    </div>
  );
};
