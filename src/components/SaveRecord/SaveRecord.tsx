import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonType } from '@components/Button';
import { useRecordStatus } from '@common/hooks/useRecordStatus';
import { QueryParams } from '@common/constants/routes.constants';
import { useStatusState } from '@src/store';

type SaveRecordProps = {
  primary?: boolean;
  onSaveRecord: (isNavigatingBack: boolean) => void;
};

const SaveRecord: FC<SaveRecordProps> = ({ primary = false, onSaveRecord }) => {
  const { isRecordEdited } = useStatusState();
  const { hasBeenSaved } = useRecordStatus();
  const [searchParams] = useSearchParams();

  const handleButtonClick = () => {
    onSaveRecord(primary);
  };

  return (
    <Button
      data-testid={`save-record${primary ? '-and-close' : '-and-keep-editing'}`}
      type={primary ? ButtonType.Primary : ButtonType.Highlighted}
      onClick={handleButtonClick}
      disabled={!searchParams.get(QueryParams.CloneOf) && !hasBeenSaved && !isRecordEdited}
    >
      <FormattedMessage id={!primary ? 'ld.saveAndKeepEditing' : 'ld.saveAndClose'} />
    </Button>
  );
};

export default memo(SaveRecord);
