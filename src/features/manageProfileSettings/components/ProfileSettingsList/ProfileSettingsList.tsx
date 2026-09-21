import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { BASE_SETTINGS_OPTIONS, ProfileSettingsMode } from '@/common/constants/profileSettings.constants';
import { Button, ButtonType } from '@/components/Button';
import { Select, SelectValue } from '@/components/Select';

import { useLoadProfileSettingsMeta, usePreferredProfileSettings } from '@/features/profiles';

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
    setMode,
    setIsCreatingSettingsNext,
    setIsEditingSettingsNext,
    setIsPreferredProfileSettings,
    setNextSelectedSettingsMeta,
  } = useManageProfileSettingsState([
    'isModified',
    'selectedProfile',
    'selectedProfileSettingsMeta',
    'setSelectedProfileSettingsMeta',
    'setSettingsName',
    'setMode',
    'setIsCreatingSettingsNext',
    'setIsEditingSettingsNext',
    'setIsPreferredProfileSettings',
    'setNextSelectedSettingsMeta',
  ]);

  const { resetSettings } = useResetSettings();

  const { setIsManageProfileSettingsUnsavedModalOpen } = useUIState(['setIsManageProfileSettingsUnsavedModalOpen']);

  const { formatMessage } = useIntl();

  const { data: settingsMeta } = useLoadProfileSettingsMeta(selectedProfile.id);
  const { data: preferredProfileSettings } = usePreferredProfileSettings(selectedProfile.id);

  const settingsMetaOptions = useMemo(() => {
    const settingsWithDefault = settingsMeta
      ? BASE_SETTINGS_OPTIONS.concat(settingsMeta.map(metaToOption))
      : BASE_SETTINGS_OPTIONS;
    return settingsWithDefault.map(option => {
      if (option.value === preferredProfileSettings?.find(p => p.profileId === selectedProfile.id)?.id.toString()) {
        option.label += ' (' + formatMessage({ id: 'ld.preferred' }) + ')';
      }
      return option;
    });
  }, [settingsMeta, preferredProfileSettings, selectedProfile]);

  const handleChange = (selected: SelectValue) => {
    if (selected.value !== '') {
      const settingMeta = settingsMeta?.find(meta => String(meta.id) === selected.value);

      if (isModified) {
        setIsEditingSettingsNext(true);
        setNextSelectedSettingsMeta(settingMeta ?? null);
        setIsManageProfileSettingsUnsavedModalOpen(true);
      } else {
        setMode(ProfileSettingsMode.Editing);
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
      setMode(ProfileSettingsMode.Creating);
      setSelectedProfileSettingsMeta(null);
      setSettingsName('');
      setIsPreferredProfileSettings(false);
    }
  };

  return (
    <div data-testid="profile-settings-select-section" className="profile-settings-select">
      <Button type={ButtonType.Primary} onClick={handleCreate} data-testid="profile-settings-select-create">
        <FormattedMessage id="ld.profileSettings.createNewSettings" />
      </Button>

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
