import { useRecoilState } from 'recoil';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { Preview } from '@components/Preview';
import state from '@state';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';
import { RESOURCE_TEMPLATE_IDS } from '@common/constants/bibframe.constants';
import { FormattedMessage } from 'react-intl';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import './FullDisplay.scss';

export const FullDisplay = () => {
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
  const { navigateToEditPage } = useNavigateToEditPage();

  return (
    !!previewContent.length && (
      <div className={DOM_ELEMENTS.classNames.fullDisplayContainer}>
        {previewContent.map(({ id, base, userValues, initKey, title, entities }) => (
          <div key={id}>
            <div className="full-display-control-panel">
              <Button
                className="close"
                data-testid="preview-remove"
                onClick={() => setPreviewContent(previewContent.filter(entry => entry.id !== id))}
              >
                <Times16 />
              </Button>
              <div className="info">
                <span className="title">{title}</span>
                <span className="type">{entities?.map(e => RESOURCE_TEMPLATE_IDS[e] ?? e)?.join(', ') ?? '-'}</span>
              </div>
              <Button onClick={() => navigateToEditPage(generateEditResourceUrl(id))} type={ButtonType.Highlighted}>
                <FormattedMessage id="marva.edit" />
              </Button>
            </div>
            {Object.keys(userValues).length ? (
              <div className="preview-contents-container">
                <Preview altSchema={base} altUserValues={userValues} altInitKey={initKey} headless />
              </div>
            ) : (
              <div>Resource description {id} is empty</div>
            )}
          </div>
        ))}
      </div>
    )
  );
};
