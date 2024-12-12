import { FormattedMessage, useIntl } from 'react-intl';
import { Button, ButtonType } from '@components/Button';
import state from '@state';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import Times16 from '@src/assets/times-16.svg?react';
import { getRecordTitle } from '@common/helpers/record.helper';

export const ViewMarcControlPane = () => {
  const isLoading = useRecoilValue(state.loadingState.isLoading);
  const resetMarcPreviewData = useResetRecoilState(state.data.marcPreview);
  const record = useRecoilValue(state.inputs.record);
  const { formatMessage } = useIntl();

  return (
    <div className="nav-block nav-block-fixed-height" data-testid="view-marc-control-pane">
      <nav>
        <Button
          data-testid="nav-close-button"
          type={ButtonType.Icon}
          onClick={resetMarcPreviewData}
          className="nav-close"
          ariaLabel={formatMessage({ id: 'ld.aria.marcPreview.close' })}
        >
          <Times16 />
        </Button>
      </nav>
      <div className="heading">
        {!isLoading && (
          <FormattedMessage
            id="ld.marcWithTitle"
            values={{
              title: (
                <span data-testid="marc-title">
                  {(record?.resource && getRecordTitle(record.resource as RecordEntry)) ?? (
                    <>&lt;{formatMessage({ id: 'ld.noTitleInBrackets' })}&gt;</>
                  )}
                </span>
              ),
            }}
          />
        )}
      </div>
      <span className="empty-block" />
    </div>
  );
};
