import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { SOURCE_TYPES } from '@/common/constants/lookup.constants';
import { Button, ButtonType } from '@/components/Button';
import { Preview } from '@/components/Preview';

import { ControlPane } from '@/features/search/ui';

import Times16 from '@/assets/times-16.svg?react';

import './HubPreview.scss';

interface HubResourceData {
  base: Schema;
  userValues: UserValues;
  initKey: string;
}

interface HubPreviewProps {
  onClose: VoidFunction;
  onAssign?: (record: ComplexLookupAssignRecordDTO) => void | Promise<void>;
  previewData: {
    id: string;
    resource: HubResourceData;
  } | null;
  previewMeta: { id: string; title: string } | null;
}

export const HubPreview: FC<HubPreviewProps> = ({ onClose, onAssign, previewData, previewMeta }) => {
  const { formatMessage } = useIntl();

  const renderCloseButton = () => (
    <Button
      ariaLabel={formatMessage({ id: 'ld.aria.complexLookup.hubPreview.close' })}
      data-testid="hub-preview-close-button"
      type={ButtonType.Icon}
      onClick={onClose}
      className="nav-close"
    >
      <Times16 />
    </Button>
  );

  const handleAssignClick = () => {
    if (!onAssign || !previewMeta) return;

    onAssign({
      id: previewMeta.id,
      title: previewMeta.title,
      sourceType: SOURCE_TYPES.LOCAL,
    });
  };

  if (!previewData) {
    return null;
  }

  return (
    <div className="hub-preview-container">
      <ControlPane label={previewMeta?.title ?? ''} showSubLabel={false} renderCloseButton={renderCloseButton}>
        {onAssign && (
          <div>
            <Button
              type={ButtonType.Highlighted}
              onClick={handleAssignClick}
              ariaLabel={formatMessage({ id: 'ld.assign' })}
              data-testid="hub-preview-assign-button"
            >
              <FormattedMessage id="ld.assign" />
            </Button>
          </div>
        )}
      </ControlPane>
      <div className="hub-preview-content">
        {previewData.resource && Object.keys(previewData.resource).length > 0 ? (
          <Preview
            altSchema={previewData.resource.base}
            altUserValues={previewData.resource.userValues}
            altInitKey={previewData.resource.initKey}
            forceRenderAllTopLevelEntities={true}
          />
        ) : (
          <div>
            <FormattedMessage id="ld.resourceWithIdIsEmpty" values={{ id: previewData.id }} />
          </div>
        )}
      </div>
    </div>
  );
};
