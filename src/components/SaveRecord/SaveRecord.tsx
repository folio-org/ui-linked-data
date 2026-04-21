import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useSaveRecord } from '@/common/hooks/useSaveRecord';
import { useSaveRecordWarning } from '@/common/hooks/useSaveRecordWarning';
import { Button, ButtonType } from '@/components/Button';
import { ModalUncontrolledAuthorities } from '@/components/ModalUncontrolledAuthorities';

type SaveRecordProps = {
  primary?: boolean;
};

const SaveRecord: FC<SaveRecordProps> = ({ primary = false }) => {
  const { shouldDisplayWarningMessage, setHasShownAuthorityWarning } = useSaveRecordWarning();
  const { isButtonDisabled, isModalOpen, openModal, closeModal, saveRecord } = useSaveRecord(primary);

  const handleButtonClick = () => {
    if (shouldDisplayWarningMessage) {
      openModal();
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    saveRecord();
    handleCloseModal();
  };

  const handleCloseModal = () => {
    if (shouldDisplayWarningMessage) {
      setHasShownAuthorityWarning(true);
    }
    closeModal();
  };

  return (
    <>
      <Button
        data-testid={`save-record${primary ? '-and-close' : '-and-keep-editing'}`}
        type={primary ? ButtonType.Primary : ButtonType.Highlighted}
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
      >
        <FormattedMessage id={primary ? 'ld.saveAndClose' : 'ld.saveAndKeepEditing'} />
      </Button>
      <ModalUncontrolledAuthorities
        isOpen={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSave}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default memo(SaveRecord);
