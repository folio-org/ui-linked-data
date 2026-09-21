import { FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { usePreferredProfileSettings } from '@/features/profiles';

import { useManageProfileSettingsState } from '@/store';

import './DefaultProfileSettingsOption.scss';

type DefaultProfileSettingsOptionProps = {
  selectedProfileId: string | number | null;
  selectedProfileSettingsId?: string | number;
};

export const DefaultProfileSettingsOption: FC<DefaultProfileSettingsOptionProps> = ({
  selectedProfileId,
  selectedProfileSettingsId,
}) => {
  const { data: defaultProfileSettings } = usePreferredProfileSettings(selectedProfileId);
  const { isPreferredProfileSettings, setIsModified, setIsPreferredProfileSettings } = useManageProfileSettingsState([
    'isPreferredProfileSettings',
    'setIsModified',
    'setIsPreferredProfileSettings',
  ]);

  useEffect(() => {
    if (defaultProfileSettings) {
      const exists = defaultProfileSettings.some(
        pref => pref.id === selectedProfileSettingsId && pref.profileId === selectedProfileId,
      );
      setIsPreferredProfileSettings(exists);
    }
  }, [selectedProfileId, selectedProfileSettingsId, defaultProfileSettings, setIsPreferredProfileSettings]);

  const handleChange = () => {
    setIsModified(true);
    setIsPreferredProfileSettings(prev => !prev);
  };

  return (
    <div className="default-profile-settings">
      <label htmlFor="default-profile-settings-control">
        <input
          type="checkbox"
          checked={isPreferredProfileSettings}
          onChange={handleChange}
          id="default-profile-settings-control"
          data-testid="default-profile-settings-control"
          disabled={!selectedProfileId}
        />
        <FormattedMessage id="ld.setDefaultProfileSettings" />
      </label>
    </div>
  );
};
