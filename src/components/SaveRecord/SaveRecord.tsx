import { FC, memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { FormattedMessage } from 'react-intl';
import { Button } from '@components/Button';

const SaveRecord: FC = () => {
  const { saveRecord } = useRecordControls();

  return (
    <Button data-testid="save-record-button" onClick={saveRecord}>
      <FormattedMessage id="marva.save-rd" />
    </Button>
  );
};

export default memo(SaveRecord);
