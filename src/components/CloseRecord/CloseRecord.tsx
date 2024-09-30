import { FC, memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';

const CloseRecord: FC = () => {
  const { discardRecord } = useRecordControls();

  return (
    <Button data-testid="close-record-button" type={ButtonType.Primary} onClick={() => discardRecord(false)}>
      <FormattedMessage id="ld.cancel" />
    </Button>
  );
};

export default memo(CloseRecord);
