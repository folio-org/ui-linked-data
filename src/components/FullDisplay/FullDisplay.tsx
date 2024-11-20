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
import { useCallback } from 'react';
import './FullDisplay.scss';

export const FullDisplay = () => {
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
  const { navigateToEditPage } = useNavigateToEditPage();

  const renderPreviewContent = useCallback(
    () =>
      previewContent.map(({ id, base, userValues, initKey, title, entities }) => {
        const resourceType = entities?.map(e => RESOURCE_TEMPLATE_IDS[e])?.[0];
        const resourceTypeWithFallback = resourceType ?? '-';
        const handleButtonClick = () => setPreviewContent(previewContent.filter(entry => entry.id !== id));

        return (
          <div key={id}>
            <div className="full-display-control-panel">
              <Button className="close" data-testid="preview-remove" onClick={handleButtonClick}>
                <Times16 />
              </Button>
              <div className="info">
                <span className="title">{title}</span>
                <span className="type">{resourceTypeWithFallback}</span>
              </div>
              <Button
                data-testid="preview-fetch"
                onClick={() => navigateToEditPage(generateEditResourceUrl(id))}
                type={ButtonType.Highlighted}
              >
                <FormattedMessage id={`ld.edit${resourceType}`} defaultMessage="Edit" />
              </Button>
            </div>
            {Object.keys(userValues).length ? (
              <div data-testid="preview-contents-container" className="preview-contents-container">
                <Preview altSchema={base} altUserValues={userValues} altInitKey={initKey} headless hideActions />
              </div>
            ) : (
              <div>
                <FormattedMessage id="ld.resourceWithIdIsEmpty" values={{ id }} />
              </div>
            )}
          </div>
        );
      }),
    [navigateToEditPage, previewContent],
  );

  return (
    !!previewContent.length && (
      <div className={DOM_ELEMENTS.classNames.fullDisplayContainer}>{renderPreviewContent()}</div>
    )
  );
};
