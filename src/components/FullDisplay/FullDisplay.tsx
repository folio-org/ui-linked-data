import { useRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { Preview } from '@components/Preview';
import state from '@state';
import './FullDisplay.scss';

export const FullDisplay = () => {
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);

  return (
    <div className="full-display-container">
      {previewContent.map(({ id, base, userValues, initKey }) => (
        <div key={id}>
          <div className="full-display-controls">
            <Link data-testid="preview-fetch" to={generateEditResourceUrl(id)} className="button">
              ✏️
            </Link>
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
