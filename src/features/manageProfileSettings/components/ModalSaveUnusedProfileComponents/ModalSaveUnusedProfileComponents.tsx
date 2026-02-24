import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { Modal } from '@/components/Modal';

import { useManageProfileSettingsState } from '@/store';

import { useSaveProfileSettings } from '../../hooks';

import './ModalSaveUnusedProfileComponents.scss';

type ModalSaveUnusedProfileComponentsProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ModalSaveUnusedProfileComponents: FC<ModalSaveUnusedProfileComponentsProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const searchResultsUri = useBackToSearchUri();
  const { saveSettings } = useSaveProfileSettings();
  const { isClosingNext, setIsClosingNext } = useManageProfileSettingsState(['isClosingNext', 'setIsClosingNext']);

  const doNext = async () => {
    await saveSettings();
    if (isClosingNext) {
      setIsClosingNext(false);
      navigate(searchResultsUri);
    }
  };

  const handleClose = () => {
    setIsClosingNext(false);
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    await doNext();
    setIsOpen(false);
  };

  return (
    <Modal
      data-testid="modal-save-unused-profile-components"
      className="modal-save-unused-profile-components"
      isOpen={isOpen}
      onClose={handleClose}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      spreadModalControls={true}
      alignTitleCenter={true}
      title={formatMessage({ id: 'ld.profileComponentsDeselected' })}
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      submitButtonLabel={formatMessage({ id: 'ld.save' })}
    >
      <div className="modal-content">
        <p>
          <FormattedMessage id="ld.removedProfileComponentsResult" />
        </p>
      </div>
    </Modal>
  );
};
