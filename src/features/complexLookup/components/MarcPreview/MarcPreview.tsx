import { FC } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { useMarcPreviewState, useUIState } from '@/store';
import { LegacySearchControlPane, useSearchContextLegacy } from '@/features/search/ui';
import { MarcContent } from '@/components/MarcContent';
import { Button, ButtonType } from '@/components/Button';
import Times16 from '@/assets/times-16.svg?react';
import { useComplexLookupValidation } from '../../hooks/useComplexLookupValidation';
import './MarcPreview.scss';

type MarcPreviewProps = {
  onClose: VoidFunction;
};

export const MarcPreview: FC<MarcPreviewProps> = ({ onClose }) => {
  const { onAssignRecord } = useSearchContextLegacy();
  const { formatMessage } = useIntl();
  const { isMarcPreviewOpen } = useUIState(['isMarcPreviewOpen']);
  const { complexValue: marcPreviewData, metadata: marcPreviewMetadata } = useMarcPreviewState([
    'complexValue',
    'metadata',
  ]);
  const { checkFailedId } = useComplexLookupValidation();

  const renderCloseButton = () => (
    <Button
      ariaLabel={formatMessage({ id: 'ld.aria.complexLookup.marcPreview.close' })}
      data-testid="nav-close-button"
      type={ButtonType.Icon}
      onClick={onClose}
      className="nav-close"
    >
      <Times16 />
    </Button>
  );

  const renderSubLabel = () => (
    <>
      {marcPreviewMetadata?.headingType} • <FormattedMessage id="ld.lastUpdated" />:
      <span className="marc-preview-sub-label-date">
        <FormattedDate value={marcPreviewData?.metadata.updatedDate ?? new Date('now')} />
      </span>
    </>
  );

  const onClickAssignButton = () => {
    onAssignRecord?.({
      id: marcPreviewMetadata?.baseId ?? '',
      title: marcPreviewMetadata?.title ?? '',
      linkedFieldValue: marcPreviewMetadata?.headingType ?? '',
    });
  };

  const isDisabledButton = checkFailedId(marcPreviewMetadata?.baseId);

  return (
    <>
      {isMarcPreviewOpen && marcPreviewData ? (
        <div className="marc-preview-container">
          <LegacySearchControlPane
            label={marcPreviewMetadata?.title ?? ''}
            renderSubLabel={renderSubLabel}
            renderCloseButton={renderCloseButton}
          >
            <div>
              <Button
                type={ButtonType.Highlighted}
                onClick={onClickAssignButton}
                ariaLabel={formatMessage({ id: 'ld.aria.marcAuthorityPreview.close' })}
                disabled={isDisabledButton}
              >
                <FormattedMessage id="ld.assign" />
              </Button>
            </div>
          </LegacySearchControlPane>
          <div className="marc-preview-content">
            <div className="marc-preview-content-title">
              <FormattedMessage id="ld.marcAuthorityRecord" />
            </div>
            <MarcContent marc={marcPreviewData} className="marc-contents" />
          </div>
        </div>
      ) : null}
    </>
  );
};
