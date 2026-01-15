import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes.constants';
import { useManageProfileSettingsState, useUIState } from '@/store';
import { Modal } from '@/components/Modal';
import './ModalCloseProfileSettings.scss';

export const ModalCloseProfileSettings = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { isManageProfileSettingsUnsavedModalOpen, setIsManageProfileSettingsUnsavedModalOpen } = useUIState([
    'isManageProfileSettingsUnsavedModalOpen',
    'setIsManageProfileSettingsUnsavedModalOpen',
  ]);
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
    setIsManageProfileSettingsUnsavedModalOpen(false);
  };

  const handleCancel = () => {
    setIsManageProfileSettingsUnsavedModalOpen(false);
    doNext();
  };

  const handleSubmit = () => {
    setIsManageProfileSettingsUnsavedModalOpen(false);
    // TODO handle save API calls
    doNext();
  };

  return (
    <Modal
      className="modal-close-profile-settings"
      isOpen={isManageProfileSettingsUnsavedModalOpen}
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
