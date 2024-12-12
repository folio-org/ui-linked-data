import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { SearchControlPane } from '@components/SearchControlPane';
import { MarcContent } from '@components/MarcContent';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';
import state from '@state';
import './MarcPreviewComplexLookup.scss';

type MarcPreviewComplexLookupProps = {
  onClose: VoidFunction;
};

export const MarcPreviewComplexLookup: FC<MarcPreviewComplexLookupProps> = ({ onClose }) => {
  const { onAssignRecord } = useSearchContext();
  const { formatMessage } = useIntl();
  const isMarcPreviewOpen = useRecoilValue(state.ui.isMarcPreviewOpen);
  const marcPreviewData = useRecoilValue(state.data.marcPreviewData);
  const marcPreviewMetadata = useRecoilValue(state.data.marcPreviewMetadata);

  const renderCloseButton = () => (
    <Button data-testid="nav-close-button" type={ButtonType.Icon} onClick={onClose} className="nav-close">
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
      id: marcPreviewMetadata?.baseId || '',
      title: marcPreviewMetadata?.title || '',
      linkedFieldValue: marcPreviewMetadata?.headingType || '',
    });
  };

  return (
    <>
      {isMarcPreviewOpen && marcPreviewData ? (
        <div className="marc-preview-container">
          <SearchControlPane
            label={marcPreviewMetadata?.title || ''}
            renderSubLabel={renderSubLabel}
            renderCloseButton={renderCloseButton}
          >
            <div>
              <Button
                type={ButtonType.Highlighted}
                onClick={onClickAssignButton}
                ariaLabel={formatMessage({ id: 'ld.aria.marcAuthorityPreview.close' })}
              >
                <FormattedMessage id="ld.assign" />
              </Button>
            </div>
          </SearchControlPane>
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
