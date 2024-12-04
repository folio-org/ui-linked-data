import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ModalDeleteRecord } from '@components/ModalDeleteRecord';
import { useModalControls } from '@common/hooks/useModalControls';
import { getRecordId } from '@common/helpers/record.helper';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { RESOURCE_URLS } from '@common/constants/routes.constants';
import { checkButtonDisabledState } from '@common/helpers/recordControls.helper';
import { Button, ButtonType } from '@components/Button';
import { useRecordStatus } from '@common/hooks/useRecordStatus';
import { useInputsState, useStatusState } from '@src/store';

const DeleteRecord: FC = () => {
  const { record } = useInputsState();
  const { isEditedRecord: isEdited } = useStatusState();
  const resourceRoutePattern = useRoutePathPattern(RESOURCE_URLS);
  const { deleteRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const { hasBeenSaved } = useRecordStatus();
  const isDisabledForEditPage =
    checkButtonDisabledState({ resourceRoutePattern, isInitiallyLoaded: !hasBeenSaved, isEdited }) || false;
  const isDisabled = !record || getRecordId(record) === DEFAULT_RECORD_ID || isDisabledForEditPage;

  return (
    <>
      <Button data-testid="delete-record-button" type={ButtonType.Text} onClick={openModal} disabled={isDisabled}>
        <FormattedMessage id="ld.deleteRd" />
      </Button>
      <ModalDeleteRecord isOpen={isModalOpen} toggleIsOpen={setIsModalOpen} deleteRecord={deleteRecord} />
    </>
  );
};

export default memo(DeleteRecord);
