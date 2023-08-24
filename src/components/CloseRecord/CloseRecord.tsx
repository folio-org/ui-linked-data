import { FC, memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useModalControls } from '@common/hooks/useModalControls';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { FormattedMessage } from 'react-intl';

const CloseRecord: FC = () => {
  const { saveRecord, discardRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();

  return (
    <>
      <button data-testid="close-record-button" onClick={openModal}>
        <FormattedMessage id="marva.close-rd" />
      </button>
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
