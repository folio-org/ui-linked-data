import { Button, ButtonType } from '@components/Button';
import { Preview } from './Preview';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';
import Times16 from '@src/assets/times-16.svg?react';
import { FormattedMessage } from 'react-intl';
import { ResourceType } from '@common/constants/record.constants';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import classNames from 'classnames';

export type ITitledPreview = {
  showCloseCtl?: boolean;
  ownId?: string;
  refId?: string | null;
  type?: string;
  previewContent?: PreviewContent;
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
  const { navigateToEditPage } = useNavigateToEditPage();
  const { title, id, base, initKey, userValues } = previewContent ?? {};
  const selectedOwnId = id ?? ownId;
  const withPreviewContent = (
    <>
      {showCloseCtl ? (
        <Button data-testid="nav-close-button" type={ButtonType.Icon} onClick={onClickClose}>
          <Times16 />
        </Button>
      ) : (
        <span className="empty-block" />
      )}
      <div className="details">
        {title && <h5>{title}</h5>}
      </div>
    </>
  );

  const navigateToOwnEditPage = () => selectedOwnId && navigateToEditPage(generateEditResourceUrl(selectedOwnId));

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
            ownId={selectedOwnId}
            referenceId={refId}
            entityType={type}
            handleNavigateToEditPage={navigateToOwnEditPage}
          />
        )}
      </div>
      <Preview altInitKey={initKey} altSchema={base} altUserValues={userValues} hideEntities />
    </div>
  );
};
