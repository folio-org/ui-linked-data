import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

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
  const { formatMessage } = useIntl();
  const SETTINGS_OPTION_DEFAULT = [
    {
      label: formatMessage({ id: 'ld.profileSettings.defaultSettings' }),
      value: 'default',
    },
  ];

  const { selectedProfile, selectedProfileSettingsMeta, setSelectedProfileSettingsMeta, setSettingsName } =
    useManageProfileSettingsState([
      'selectedProfile',
      'selectedProfileSettingsMeta',
      'setSelectedProfileSettingsMeta',
      'setSettingsName',
    ]);
  const { setIsManageProfileSettingsCreateSavedSettingModalOpen } = useUIState([
    'setIsManageProfileSettingsCreateSavedSettingModalOpen',
  ]);
  const { resetSettings } = useResetSettings();
  const { data: settingsMeta } = useLoadProfileSettingsMeta(selectedProfile.id);

  const settingsMetaOptions = useMemo(() => {
    return settingsMeta ? SETTINGS_OPTION_DEFAULT.concat(settingsMeta.map(metaToOption)) : SETTINGS_OPTION_DEFAULT;
  }, [SETTINGS_OPTION_DEFAULT, settingsMeta]);

  const handleChange = (selected: SelectValue) => {
    resetSettings();
    const settingMeta = settingsMeta?.find(meta => String(meta.id) === selected.value);
    setSelectedProfileSettingsMeta(settingMeta || null);
    setSettingsName(settingMeta?.name || '');
  };

  return (
    <div data-testid="profile-settings-selector-section" className="profile-settings-selector">
      <label id="profile-settings-selector-label" htmlFor="profile-settings-selector">
        <FormattedMessage id="ld.profileSettings.savedSettings" />
      </label>
      <Select
        ariaLabelledBy="profile-settings-selector-label"
        data-testid="profile-settings-selector"
        id="profile-settings-selector"
        value={String(selectedProfileSettingsMeta?.id || 'default')}
        options={settingsMetaOptions}
        onChange={handleChange}
      />
      <Button
        type={ButtonType.Highlighted}
        label="New"
        onClick={() => setIsManageProfileSettingsCreateSavedSettingModalOpen(true)}
      />
    </div>
  );
};
