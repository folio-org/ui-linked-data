import { FC, memo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import state from '@state';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ModalDeleteRecord } from '@components/ModalDeleteRecord';
import { useModalControls } from '@common/hooks/useModalControls';
import { getRecordId } from '@common/helpers/record.helper';

const DeleteRecord: FC = () => {
  const record = useRecoilValue(state.inputs.record);
  const { deleteRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const isDisabled = !record || getRecordId(record) === DEFAULT_RECORD_ID;

  return (
    <>
      <button data-testid="delete-record-button" onClick={openModal} disabled={isDisabled}>
        <FormattedMessage id="marva.delete-rd" />
      </button>
      <ModalDeleteRecord isOpen={isModalOpen} toggleIsOpen={setIsModalOpen} deleteRecord={deleteRecord} />
    </>
  );
};

export default memo(DeleteRecord);
