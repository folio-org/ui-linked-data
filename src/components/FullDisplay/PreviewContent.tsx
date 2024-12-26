import { FormattedMessage, useIntl } from 'react-intl';
import { RESOURCE_TEMPLATE_IDS } from '@common/constants/bibframe.constants';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { Button, ButtonType } from '@components/Button';
import { Preview } from '@components/Preview';
import { useInputsState } from '@src/store';
import Times16 from '@src/assets/times-16.svg?react';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import './FullDisplay.scss';

export const PreviewContent = () => {
  const { previewContent, setPreviewContent } = useInputsState();
  const { formatMessage } = useIntl();
  const { navigateToEditPage } = useNavigateToEditPage();

  return previewContent.map(({ id, base, userValues, initKey, title, entities }) => {
    const resourceType = entities?.map(e => RESOURCE_TEMPLATE_IDS[e])?.[0];
    const resourceTypeWithFallback = resourceType ?? '-';
    const handleButtonClick = () => setPreviewContent(previewContent.filter(entry => entry.id !== id));

    return (
      <section key={id} className={DOM_ELEMENTS.classNames.fullDisplayContainer}>
        <div className="full-display-control-panel">
          <Button
            className="close"
            data-testid="preview-remove"
            onClick={handleButtonClick}
            ariaLabel={formatMessage({ id: 'ld.aria.sections.closeResourcePreview' })}
          >
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
            <Preview altSchema={base} altUserValues={userValues} altInitKey={initKey} />
          </div>
        ) : (
          <div>
            <FormattedMessage id="ld.resourceWithIdIsEmpty" values={{ id }} />
          </div>
        )}
      </section>
    );
  });
};
