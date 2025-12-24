import { FC } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { useMarcPreviewState, useUIState } from '@/store';
import { ControlPane } from '@/features/search/ui';
import { MarcContent } from '@/components/MarcContent';
import { Button, ButtonType } from '@/components/Button';
import Times16 from '@/assets/times-16.svg?react';
import './MarcPreview.scss';

interface MarcPreviewProps {
  onClose: VoidFunction;
  onAssign?: (record: ComplexLookupAssignRecordDTO) => void | Promise<void>;
  checkFailedId?: (id?: string) => boolean;
}

export const MarcPreview: FC<MarcPreviewProps> = ({ onClose, onAssign, checkFailedId }) => {
  const { formatMessage } = useIntl();
  const { isMarcPreviewOpen } = useUIState(['isMarcPreviewOpen']);
  const { complexValue: marcPreviewData, metadata: marcPreviewMetadata } = useMarcPreviewState([
    'complexValue',
    'metadata',
  ]);

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

  const subLabel = (
    <>
      {marcPreviewMetadata?.headingType} • <FormattedMessage id="ld.lastUpdated" />:
      <span className="marc-preview-sub-label-date">
        <FormattedDate value={marcPreviewData?.metadata.updatedDate ?? new Date()} />
      </span>
    </>
  );

  const handleAssignClick = () => {
    if (!onAssign || !marcPreviewMetadata?.baseId) return;

    // Call shared assignment handler with metadata from preview
    onAssign({
      id: marcPreviewMetadata.baseId,
      title: marcPreviewMetadata.title ?? '',
      linkedFieldValue: marcPreviewMetadata.headingType ?? '',
    });
  };

  const isDisabledButton = checkFailedId?.(marcPreviewMetadata?.baseId) ?? false;

  return (
    <>
      {isMarcPreviewOpen && marcPreviewData ? (
        <div className="marc-preview-container">
          <ControlPane
            label={marcPreviewMetadata?.title ?? ''}
            subLabel={subLabel}
            showSubLabel={true}
            renderCloseButton={renderCloseButton}
          >
            {onAssign && (
              <div>
                <Button
                  type={ButtonType.Highlighted}
                  onClick={handleAssignClick}
                  ariaLabel={formatMessage({ id: 'ld.assign' })}
                  disabled={isDisabledButton}
                  data-testid="marc-preview-assign-button"
                >
                  <FormattedMessage id="ld.assign" />
                </Button>
              </div>
            )}
          </ControlPane>
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
