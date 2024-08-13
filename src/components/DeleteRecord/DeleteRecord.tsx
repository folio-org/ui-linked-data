import { FC, memo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import state from '@state';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ModalDeleteRecord } from '@components/ModalDeleteRecord';
import { useModalControls } from '@common/hooks/useModalControls';
import { getRecordId } from '@common/helpers/record.helper';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { RESOURCE_URLS } from '@common/constants/routes.constants';
import { checkButtonDisabledState } from '@common/helpers/recordControls.helper';
import { Button, ButtonType } from '@components/Button';

const DeleteRecord: FC = () => {
  const record = useRecoilValue(state.inputs.record);
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const isInitiallyLoaded = useRecoilValue(state.status.recordIsInitiallyLoaded);
  const { deleteRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const resourceRoutePattern = useRoutePathPattern(RESOURCE_URLS);
  const isDisabledForEditPage =
    checkButtonDisabledState({ resourceRoutePattern, isInitiallyLoaded, isEdited }) || false;
  const isDisabled = !record || getRecordId(record) === DEFAULT_RECORD_ID || isDisabledForEditPage;

  return (
    <>
      <Button data-testid="delete-record-button" type={ButtonType.Text} onClick={openModal} disabled={isDisabled}>
        <FormattedMessage id="marva.deleteRd" />
      </Button>
      <ModalDeleteRecord isOpen={isModalOpen} toggleIsOpen={setIsModalOpen} deleteRecord={deleteRecord} />
    </>
  );
};

export default memo(DeleteRecord);
