import { FormattedMessage, useIntl } from 'react-intl';

import classNames from 'classnames';

import { ResourceType } from '@/common/constants/record.constants';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { Button, ButtonType } from '@/components/Button';

import type { ProcessedResource } from '@/features/resources';

import Times16 from '@/assets/times-16.svg?react';

import { PreviewActionsDropdown } from '../PreviewActionsDropdown';
import { Preview } from './Preview';

export type ITitledPreview = {
  showCloseCtl?: boolean;
  ownId?: string;
  refId?: string | null;
  type?: string;
  previewContent?: ProcessedResource;
  onClickClose?: VoidFunction;
};

export const TitledPreview = ({
  showCloseCtl = true,
  ownId,
  refId,
  type,
  previewContent,
  onClickClose,
}: ITitledPreview) => {
  const { formatMessage } = useIntl();
  const { navigateToEditPage } = useNavigateToEditPage();
  const { title, schema, initKey, userValues } = previewContent ?? {};
  const withPreviewContent = (
    <>
      {showCloseCtl ? (
        <Button
          data-testid="nav-close-button"
          type={ButtonType.Icon}
          onClick={onClickClose}
          ariaLabel={formatMessage({ id: 'ld.aria.resourcePreview.close' })}
        >
          <Times16 />
        </Button>
      ) : (
        <span className="empty-block" />
      )}
      <div className="details">{title && <h5>{title}</h5>}</div>
    </>
  );

  const navigateToOwnEditPage = () => ownId && navigateToEditPage(generateEditResourceUrl(ownId));

  return (
    <div className="titled-preview">
      <div className={classNames('titled-preview-header', { 'titled-preview-header-plain': !previewContent })}>
        {previewContent ? (
          withPreviewContent
        ) : (
          <h3>
            <FormattedMessage id={`ld.${type}`} defaultMessage="Resource" />
          </h3>
        )}
        {type === ResourceType.work && !previewContent && (
          <Button
            type={ButtonType.Primary}
            className="toggle-entity-edit"
            data-testid="edit-self-as-ref"
            onClick={navigateToOwnEditPage}
          >
            <FormattedMessage id="ld.editWork" />
          </Button>
        )}
        {type === ResourceType.instance && (
          <PreviewActionsDropdown
            ownId={ownId}
            referenceId={refId}
            entityType={type}
            handleNavigateToEditPage={navigateToOwnEditPage}
          />
        )}
      </div>
      <Preview altInitKey={initKey} altSchema={schema} altUserValues={userValues} hideEntities />
    </div>
  );
};
