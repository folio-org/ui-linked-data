import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { SearchControlPane } from '@components/SearchControlPane';
import { MarcContent } from '@components/MarcContent';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';
import state from '@state';
import './MarсPreviewComplexLookup.scss';

type MarсPreviewComplexLookupProps = {
  onClose: VoidFunction;
};

export const MarсPreviewComplexLookup: FC<MarсPreviewComplexLookupProps> = ({ onClose }) => {
  const marcPreviewData = useRecoilValue(state.data.marcPreviewData);
  const marcPreviewMetadata = useRecoilValue(state.data.marcPreviewMetadata);

  const renderCloseButton = () => (
    <Button data-testid="nav-close-button" type={ButtonType.Icon} onClick={onClose} className="nav-close">
      <Times16 />
    </Button>
  );

  const subLabel = (
    <>
      {marcPreviewMetadata?.headingType} • <FormattedMessage id="ld.lastUpdated" />:
      <FormattedDate value={new Date(marcPreviewData?.metadata.updatedDate ?? 'now')} />
    </>
  );

  return (
    <>
      {marcPreviewData ? (
        <div>
          <SearchControlPane
            label={marcPreviewMetadata?.title || ''}
            subLabel={subLabel}
            renderCloseButton={renderCloseButton}
          />
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
