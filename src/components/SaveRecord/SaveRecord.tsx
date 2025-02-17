import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonType } from '@components/Button';
import { useRecordStatus } from '@common/hooks/useRecordStatus';
import { QueryParams } from '@common/constants/routes.constants';
import { ModalUncontrolledAuthorities } from '@components/ModalUncontrolledAuthorities';
import { useInputsState, useStatusState, useUIState } from '@src/store';
import { useModalControls } from '@common/hooks/useModalControls';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { TYPE_URIS } from '@common/constants/bibframe.constants';

type SaveRecordProps = {
  primary?: boolean;
};

const SaveRecord: FC<SaveRecordProps> = ({ primary = false }) => {
  const { isRecordEdited } = useStatusState();
  const { hasShownAuthorityWarning, setHasShownAuthorityWarning } = useUIState();
  const { userValues, selectedRecordBlocks } = useInputsState();
  const { hasBeenSaved } = useRecordStatus();
  const [searchParams] = useSearchParams();
  const { saveRecord } = useRecordControls();
  const { isModalOpen, openModal, closeModal } = useModalControls();

  const isWorkEditPage = selectedRecordBlocks?.block === TYPE_URIS.WORK;
  const hasSelectedUncontrolledAuthority = Object.values(userValues).some((value: UserValue) => {
    return value.contents.some(content => {
      return content?.meta?.isPreferred !== undefined && !content?.meta?.isPreferred;
    });
  });
  const shouldDisplayWarningMessage = isWorkEditPage && hasSelectedUncontrolledAuthority && !hasShownAuthorityWarning;

  const handleButtonClick = () => {
    if (shouldDisplayWarningMessage) {
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
