import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { Button, ButtonType } from '@/components/Button';

import { useManageProfileSettingsState, useUIState } from '@/store';

import { useSaveProfileSettings } from '../../hooks';

import './ManageProfileSettingsControls.scss';

export const ManageProfileSettingsControls = memo(() => {
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const { unusedComponents, isModified, setIsClosingNext } = useManageProfileSettingsState([
    'unusedComponents',
    'isModified',
    'setIsClosingNext',
  ]);
  const { saveSettings } = useSaveProfileSettings();
  const { setIsManageProfileSettingsUnusedComponentsModalOpen } = useUIState([
    'setIsManageProfileSettingsUnusedComponentsModalOpen',
  ]);

  const handleButtonClick = async () => {
    if (unusedComponents.length > 0) {
      setIsManageProfileSettingsUnusedComponentsModalOpen(true);
    } else {
      await saveSettings();
    }
  };

  const handleButtonClickAndClose = async () => {
    if (unusedComponents.length > 0) {
      setIsClosingNext(true);
      setIsManageProfileSettingsUnusedComponentsModalOpen(true);
    } else {
      await saveSettings();
      navigate(searchResultsUri);
    }
  };

  return (
    <div data-testid="manage-profile-settings-controls" className="manage-profile-settings-controls">
      <Button
        data-testid="save-and-close"
        type={ButtonType.Primary}
        onClick={handleButtonClickAndClose}
        disabled={!isModified}
      >
        <FormattedMessage id="ld.saveAndClose" />
      </Button>

      <Button
        data-testid="save-and-keep-editing"
        type={ButtonType.Highlighted}
        onClick={handleButtonClick}
        disabled={!isModified}
      >
        <FormattedMessage id="ld.saveAndKeepEditing" />
      </Button>
    </div>
  );
});
