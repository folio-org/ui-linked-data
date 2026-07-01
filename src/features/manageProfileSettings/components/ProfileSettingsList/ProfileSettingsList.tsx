import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { BASE_SETTINGS_OPTIONS } from '@/common/constants/profileSettings.constants';
import { Button, ButtonType } from '@/components/Button';
import { Select, SelectValue } from '@/components/Select';

import { useLoadProfileSettingsMeta } from '@/features/profiles';

import { useManageProfileSettingsState, useUIState } from '@/store';

import { useResetSettings } from '../../hooks';

import './ProfileSettingsList.scss';

const metaToOption = (meta: ProfileSettingsMeta) => {
  return {
    label: meta.name,
    value: String(meta.id),
  };
};

export const ProfileSettingsList = () => {
  const {
    isModified,
    selectedProfile,
    selectedProfileSettingsMeta,
    setSelectedProfileSettingsMeta,
    setSettingsName,
    setIsCreating,
    setIsCreatingSettingsNext,
    setIsEditingSettingsNext,
    setNextSelectedSettingsMeta,
  } = useManageProfileSettingsState([
    'isModified',
    'selectedProfile',
    'selectedProfileSettingsMeta',
    'setSelectedProfileSettingsMeta',
    'setSettingsName',
    'setIsCreating',
    'setIsCreatingSettingsNext',
    'setIsEditingSettingsNext',
    'setNextSelectedSettingsMeta',
  ]);

  const { resetSettings } = useResetSettings();

  const { setIsManageProfileSettingsUnsavedModalOpen } = useUIState(['setIsManageProfileSettingsUnsavedModalOpen']);

  const { data: settingsMeta } = useLoadProfileSettingsMeta(selectedProfile.id);

  const settingsMetaOptions = useMemo(() => {
    return settingsMeta ? BASE_SETTINGS_OPTIONS.concat(settingsMeta.map(metaToOption)) : BASE_SETTINGS_OPTIONS;
  }, [settingsMeta]);

  const handleChange = (selected: SelectValue) => {
    if (selected.value !== '') {
      const settingMeta = settingsMeta?.find(meta => String(meta.id) === selected.value);

      if (isModified) {
        setIsEditingSettingsNext(true);
        setNextSelectedSettingsMeta(settingMeta ?? null);
        setIsManageProfileSettingsUnsavedModalOpen(true);
      } else {
        setIsCreating(false);
        resetSettings();

        setSelectedProfileSettingsMeta(settingMeta ?? null);
        setSettingsName(settingMeta?.name ?? '');
      }
    }
  };

  const handleCreate = () => {
    if (isModified) {
      setIsCreatingSettingsNext(true);
      setIsManageProfileSettingsUnsavedModalOpen(true);
    } else {
      setIsCreating(true);
      setSelectedProfileSettingsMeta(null);
      setSettingsName('');
    }
  };

  return (
    <div data-testid="profile-settings-select-section" className="profile-settings-select">
      <Button
        type={ButtonType.Highlighted}
        label={<FormattedMessage id="ld.create.base" />}
        onClick={handleCreate}
        data-testid="profile-settings-select-create"
      />

      <label id="profile-settings-select-label" htmlFor="profile-settings-select">
        <FormattedMessage id="ld.profileSettings.savedSettings" />
      </label>
      <Select
        ariaLabelledBy="profile-settings-select-label"
        data-testid="profile-settings-select"
        id="profile-settings-select"
        value={String(selectedProfileSettingsMeta?.id || '')}
        options={settingsMetaOptions}
        onChange={handleChange}
        disabled={settingsMetaOptions.length === 0}
      />
    </div>
  );
};
