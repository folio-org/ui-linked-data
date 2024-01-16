import { FC, memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';

const SaveRecord: FC = () => {
  const { saveRecord } = useRecordControls();

  return (
    <Button data-testid="save-record-button" type={ButtonType.Text} onClick={saveRecord}>
      <FormattedMessage id="marva.saveRd" />
    </Button>
  );
};

export default memo(SaveRecord);
