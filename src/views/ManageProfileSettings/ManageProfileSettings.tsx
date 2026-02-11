import { useEffect, useState } from 'react';

import { ModalCloseProfileSettings } from '@/features/manageProfileSettings/components/ModalCloseProfileSettings';
import { ProfileSettings } from '@/features/manageProfileSettings/components/ProfileSettings';
import { ProfilesList } from '@/features/manageProfileSettings/components/ProfilesList';

import { useManageProfileSettingsState, useUIState } from '@/store';

import './ManageProfileSettings.scss';

//TODO: add ModalSaveUnusedProfileFields

export const ManageProfileSettings = () => {
  const { selectedProfile } = useManageProfileSettingsState(['selectedProfile']);
  const {
    isManageProfileSettingsUnsavedModalOpen,
    setIsManageProfileSettingsBelowBreakpoint,
    setIsManageProfileSettingsShowEditor,
    setIsManageProfileSettingsShowProfiles,
    setIsManageProfileSettingsUnsavedModalOpen,
  } = useUIState([
    'isManageProfileSettingsUnsavedModalOpen',
    'setIsManageProfileSettingsBelowBreakpoint',
    'setIsManageProfileSettingsShowEditor',
    'setIsManageProfileSettingsShowProfiles',
    'setIsManageProfileSettingsUnsavedModalOpen',
  ]);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (viewportWidth < 768) {
      if (selectedProfile) {
        setIsManageProfileSettingsShowProfiles(false);
        setIsManageProfileSettingsShowEditor(true);
      } else {
        setIsManageProfileSettingsShowProfiles(true);
        setIsManageProfileSettingsShowEditor(false);
      }
      setIsManageProfileSettingsBelowBreakpoint(true);
    } else {
      setIsManageProfileSettingsBelowBreakpoint(false);
      setIsManageProfileSettingsShowProfiles(true);
      setIsManageProfileSettingsShowEditor(true);
    }
  }, [viewportWidth]);

  return (
    <>
      <div data-testid="manage-profile-settings" className="manage-profile-settings">
        <ProfilesList />
        <ProfileSettings />
      </div>
      <ModalCloseProfileSettings
        isOpen={isManageProfileSettingsUnsavedModalOpen}
        setIsOpen={setIsManageProfileSettingsUnsavedModalOpen}
      />
    </>
  );
};
