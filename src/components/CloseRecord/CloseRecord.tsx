import { FC, memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useModalControls } from '@common/hooks/useModalControls';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';

const CloseRecord: FC = () => {
  const { saveRecord, discardRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();

  return (
    <>
      <Button data-testid="close-record-button" type={ButtonType.Text} onClick={openModal}>
        <FormattedMessage id="marva.closeRd" />
      </Button>
      <ModalCloseRecord
        isOpen={isModalOpen}
        toggleIsOpen={setIsModalOpen}
        saveRecord={saveRecord}
        discardRecord={discardRecord}
      />
    </>
  );
};

export default memo(CloseRecord);
