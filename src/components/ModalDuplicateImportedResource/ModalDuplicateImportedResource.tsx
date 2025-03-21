import { memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useUIState } from '@src/store';
import './ModalDuplicateImportedResource.scss';

export const ModalDuplicateImportedResource = memo(() => {
  const { isDuplicateImportedResourceModalOpen, setIsDuplicateImportedResourceModalOpen } = useUIState();
  const { formatMessage } = useIntl();
  const { dispatchNavigateToOriginEventWithFallback } = useContainerEvents();

  return (
    <Modal
      className="duplicate-imported-resource"
      isOpen={isDuplicateImportedResourceModalOpen}
      title={formatMessage({ id: 'ld.duplicateImportWarn' })}
      submitButtonLabel={formatMessage({ id: 'ld.continue' })}
      submitButtonDisabled
      alignTitleCenter
      cancelButtonLabel={formatMessage({ id: 'ld.backToInventory' })}
      onClose={() => setIsDuplicateImportedResourceModalOpen(false)}
      onCancel={() => dispatchNavigateToOriginEventWithFallback()}
    >
      <div className="duplicate-imported-resource-contents" data-testid="modal-duplicate-imported-resource">
        <FormattedMessage id="ld.rdPropertiesMatchContinue" />
      </div>
    </Modal>
  );
});
