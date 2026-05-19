import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, ButtonType } from '@/components/Button';

import { useRecordNavigation } from '@/features/resources';

const CloseRecord: FC = () => {
  const { discardRecord } = useRecordNavigation();

  return (
    <Button data-testid="close-record-button" type={ButtonType.Primary} onClick={() => discardRecord(false)}>
      <FormattedMessage id="ld.cancel" />
    </Button>
  );
};

export default memo(CloseRecord);
