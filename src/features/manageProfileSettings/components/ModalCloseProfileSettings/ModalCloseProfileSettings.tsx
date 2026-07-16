import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { Modal } from '@/components/Modal';

import { useManageProfileSettingsState, useUIState } from '@/store';

import { useResetSettings, useSaveProfileSettings } from '../../hooks';

import './ModalCloseProfileSettings.scss';

type ModalCloseProfileSettingsProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ModalCloseProfileSettings: FC<ModalCloseProfileSettingsProps> = ({ isOpen, setIsOpen }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const {
    isClosingNext,
    setIsClosingNext,
    nextSelectedProfile,
    setNextSelectedProfile,
    setSelectedProfile,
    setIsModified,
    setIsCreating,
    isCreatingSettingsNext,
    setIsCreatingSettingsNext,
    isEditingSettingsNext,
    setIsEditingSettingsNext,
    nextSelectedSettingsMeta,
    setNextSelectedSettingsMeta,
    setSelectedProfileSettingsMeta,
    setSettingsName,
    setIsPreferredProfileSettings,
  } = useManageProfileSettingsState([
    'isClosingNext',
    'setIsClosingNext',
    'nextSelectedProfile',
    'setNextSelectedProfile',
    'setSelectedProfile',
    'resetSelectedProfileSettingsMeta',
    'setIsModified',
    'setIsCreating',
    'isCreatingSettingsNext',
    'setIsCreatingSettingsNext',
    'isEditingSettingsNext',
    'setIsEditingSettingsNext',
    'nextSelectedSettingsMeta',
    'setNextSelectedSettingsMeta',
    'setSelectedProfileSettingsMeta',
    'setSettingsName',
    'setIsPreferredProfileSettings',
  ]);
  const { resetSettings } = useResetSettings();
  const { setIsManageProfileSettingsShowProfiles, setIsManageProfileSettingsShowEditor } = useUIState([
    'setIsManageProfileSettingsShowProfiles',
    'setIsManageProfileSettingsShowEditor',
  ]);
  const { saveSettings } = useSaveProfileSettings();

  const doNext = () => {
    setIsModified(false);
    if (isClosingNext) {
      setIsClosingNext(false);
      navigate(searchResultsUri);
    } else if (nextSelectedProfile) {
      setSelectedProfile(nextSelectedProfile);
      resetSettings();
      setIsManageProfileSettingsShowProfiles(false);
      setIsManageProfileSettingsShowEditor(true);
    } else if (isCreatingSettingsNext) {
      setIsCreating(true);
      setSelectedProfileSettingsMeta(null);
      setSettingsName('');
      setIsPreferredProfileSettings(false);
      setIsCreatingSettingsNext(false);
    } else if (isEditingSettingsNext) {
      setIsCreating(false);
      resetSettings();
      setSelectedProfileSettingsMeta(nextSelectedSettingsMeta);
      setSettingsName(nextSelectedSettingsMeta?.name ?? '');
      setIsEditingSettingsNext(false);
      setNextSelectedSettingsMeta(null);
    }
  };

  const handleClose = () => {
    setIsClosingNext(false);
    setIsCreatingSettingsNext(false);
    setIsEditingSettingsNext(false);
    setNextSelectedProfile(null);
    setNextSelectedSettingsMeta(null);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    doNext();
  };

  const handleSubmit = async () => {
    setIsOpen(false);
    await saveSettings();
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
      title={formatMessage({ id: 'ld.unsavedProfileChanges' })}
      cancelButtonLabel={formatMessage({ id: 'ld.continueWithoutSaving' })}
      submitButtonLabel={formatMessage({ id: 'ld.saveAndContinue' })}
    >
      <p>
        <FormattedMessage id="ld.unsavedProfilePrompt" />
      </p>
      <p>
        <FormattedMessage id="ld.unsavedProfileNote" />
      </p>
    </Modal>
  );
};
