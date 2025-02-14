import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonType } from '@components/Button';
import { useRecordStatus } from '@common/hooks/useRecordStatus';
import { QueryParams } from '@common/constants/routes.constants';
import { ModalUncontrolledAuthorities } from '@components/ModalUncontrolledAuthorities';
import { useStatusState, useUIState } from '@src/store';
import { useModalControls } from '@common/hooks/useModalControls';
import { useRecordControls } from '@common/hooks/useRecordControls';

type SaveRecordProps = {
  primary?: boolean;
};

const SaveRecord: FC<SaveRecordProps> = ({ primary = false }) => {
  const { isRecordEdited } = useStatusState();
  const { hasShownAuthorityWarning, setHasShownAuthorityWarning } = useUIState();
  const { hasBeenSaved } = useRecordStatus();
  const [searchParams] = useSearchParams();
  const { saveRecord } = useRecordControls();
  const { isModalOpen, openModal, closeModal } = useModalControls();

  const handleButtonClick = () => {
    const isVisibleModal = true;

    if (isVisibleModal && !hasShownAuthorityWarning) {
      openModal();
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    saveRecord({ isNavigatingBack: primary });
    onCloseModal();
  };

  const onCloseModal = () => {
    if (!hasShownAuthorityWarning) {
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
        disabled={!searchParams.get(QueryParams.CloneOf) && !hasBeenSaved && !isRecordEdited}
      >
        <FormattedMessage id={!primary ? 'ld.saveAndKeepEditing' : 'ld.saveAndClose'} />
      </Button>
      <ModalUncontrolledAuthorities
        isOpen={isModalOpen}
        onCancel={onCloseModal}
        onSubmit={handleSave}
        onClose={onCloseModal}
      />
    </>
  );
};

export default memo(SaveRecord);
