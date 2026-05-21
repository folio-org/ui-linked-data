import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { RESOURCE_TEMPLATE_IDS } from '@/common/constants/bibframe.constants';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { Button, ButtonType } from '@/components/Button';

import { Preview } from '@/features/preview';
import { useResourcePreviewQuery } from '@/features/resources';

import { useInputsState } from '@/store';

import Times16 from '@/assets/times-16.svg?react';

import './FullDisplay.scss';

const PreviewContentItem = ({ resourceId, onClose }: { resourceId: string; onClose: (id: string) => void }) => {
  const { formatMessage } = useIntl();
  const { navigateToEditPage } = useNavigateToEditPage();
  const { data } = useResourcePreviewQuery(resourceId, 'search-preview');

  if (!data) return null;

  const { schema, userValues, initKey, title, entities } = data;
  const resourceType = entities?.map(e => RESOURCE_TEMPLATE_IDS[e])?.[0];

  return (
    <section className={DOM_ELEMENTS.classNames.fullDisplayContainer}>
      <div className="full-display-control-panel">
        <Button
          type={ButtonType.Icon}
          className="close"
          data-testid="preview-remove"
          onClick={() => onClose(resourceId)}
          ariaLabel={formatMessage({ id: 'ld.aria.sections.closeResourcePreview' })}
        >
          <Times16 />
        </Button>
        <div className="info">
          <h2 className="title">{title}</h2>
        </div>
        <Button
          data-testid="preview-fetch"
          onClick={() => navigateToEditPage(generateEditResourceUrl(resourceId))}
          type={ButtonType.Highlighted}
        >
          <FormattedMessage id={`ld.edit${resourceType}`} defaultMessage="Edit" />
        </Button>
      </div>
      {Object.keys(userValues).length ? (
        <div data-testid="preview-contents-container" className="preview-contents-container">
          <Preview altSchema={schema} altUserValues={userValues} altInitKey={initKey} forceRenderAllTopLevelEntities />
        </div>
      ) : (
        <div>
          <FormattedMessage id="ld.resourceWithIdIsEmpty" values={{ id: resourceId }} />
        </div>
      )}
    </section>
  );
};

export const PreviewContent = () => {
  const { activePreviewIds, setActivePreviewIds } = useInputsState(['activePreviewIds', 'setActivePreviewIds']);

  const handleClose = useCallback(
    (id: string) => {
      setActivePreviewIds(activePreviewIds.filter(prevId => prevId !== id));
    },
    [activePreviewIds, setActivePreviewIds],
  );

  return activePreviewIds.map(id => <PreviewContentItem key={id} resourceId={id} onClose={handleClose} />);
};
