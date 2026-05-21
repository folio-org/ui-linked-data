import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { RESOURCE_URLS } from '@/common/constants/routes.constants';
import { checkButtonDisabledState } from '@/common/helpers/recordControls.helper';
import { useModalControls } from '@/common/hooks/useModalControls';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { Button, ButtonType } from '@/components/Button';

import { useRecordMutations } from '@/features/resources';

import { useInputsState, useStatusState } from '@/store';

import { useRecordStatus } from '../../hooks/useRecordStatus';
import { ModalDeleteRecord } from '../modals';

const DeleteRecord: FC = () => {
  const { record } = useInputsState(['record']);
  const { isRecordEdited: isEdited } = useStatusState(['isRecordEdited']);
  const resourceRoutePattern = useRoutePathPattern(RESOURCE_URLS);
  const { deleteRecord } = useRecordMutations();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const { hasBeenSaved } = useRecordStatus();
  const isDisabledForEditPage =
    checkButtonDisabledState({ resourceRoutePattern, isInitiallyLoaded: !hasBeenSaved, isEdited }) || false;
  const isDisabled = !record || isDisabledForEditPage;

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
