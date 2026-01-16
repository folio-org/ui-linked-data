import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes.constants';
import { useManageProfileSettingsState } from '@/store';
import { Modal } from '@/components/Modal';
import './ModalCloseProfileSettings.scss';

type ModalCloseProfileSettingsProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ModalCloseProfileSettings: FC<ModalCloseProfileSettingsProps> = ({ isOpen, setIsOpen }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { isClosingNext, setIsClosingNext, nextSelectedProfile, setSelectedProfile, setIsModified } =
    useManageProfileSettingsState([
      'isClosingNext',
      'setIsClosingNext',
      'nextSelectedProfile',
      'setSelectedProfile',
      'setIsModified',
    ]);

  const doNext = () => {
    setIsModified(false);
    if (isClosingNext) {
      setIsClosingNext(false);
      navigate(ROUTES.SEARCH.uri);
    } else {
      setSelectedProfile(nextSelectedProfile);
    }
  };

  const handleClose = () => {
    setIsClosingNext(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    doNext();
  };

  const handleSubmit = () => {
    setIsOpen(false);
    // TODO: handle save API calls
    doNext();
  };

  return (
    <Modal
      data-testid="modal-close-profile-settings"
      className="modal-close-profile-settings"
      isOpen={isOpen}
      onClose={handleClose}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      spreadModalControls={true}
      alignTitleCenter={true}
      title={formatMessage({ id: 'ld.unsavedProfileChanges' })}
      cancelButtonLabel={formatMessage({ id: 'ld.continueWithoutSaving' })}
      submitButtonLabel={formatMessage({ id: 'ld.saveAndContinue' })}
    >
      <div className="modal-content">
        <p>
          <FormattedMessage id="ld.unsavedProfilePrompt" />
        </p>
        <p>
          <FormattedMessage id="ld.unsavedProfileNote" />
        </p>
      </div>
    </Modal>
  );
};
