import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { PROFILE_SETTINGS_DEFAULT_OPTION } from '@/common/constants/profileSettings.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import { getRecordProfileId } from '@/common/helpers/record.helper';
import { useDismissMenu } from '@/common/hooks/useDismissMenu';
import { Button, ButtonType } from '@/components/Button';

import { useLoadProfileSettingsMeta } from '@/features/profiles';

import { useInputsState, useProfileState } from '@/store';

import Settings from '@/assets/settings.svg?react';

export const ProfileSettingsSelector = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const { record } = useInputsState(['record']);
  const { setSelectedProfileSettingsId } = useProfileState(['setSelectedProfileSettingsId']);
  const recordProfileId = getRecordProfileId(record);
  const profileIdParam = searchParams.get(QueryParams.ProfileId);
  const selectedProfileId = recordProfileId ?? profileIdParam;
  const { data: profileSettings } = useLoadProfileSettingsMeta(selectedProfileId);

  const { isOpen: isMenuEnabled, setIsOpen: setIsMenuEnabled, toggle: toggleIsMenuEnabled } = useDismissMenu(ref);

  const handleSettingClick = async (profileSettingsId: string | number) => {
    setIsMenuEnabled(false);
    setSelectedProfileSettingsId(profileSettingsId.toString());
  };

  return (
    <div className="profile-settings-select" ref={ref}>
      <Button ariaHaspopup="menu" ariaExpanded={isMenuEnabled} onClick={toggleIsMenuEnabled}>
        <Settings />
      </Button>
      {isMenuEnabled && (
        <ul
          data-testid="profile-settings-select-menu"
          className="profile-settings-select-menu"
          role="menu" // NOSONAR
          aria-labelledby="selector-title"
        >
          <li id="selector-title" role="none">
            <FormattedMessage id="ld.applyProfileSettings" />
          </li>
          <li role="none">
            <Button
              type={ButtonType.Text}
              label={<FormattedMessage id="ld.profileDefaults" />}
              role="menuitem"
              onClick={() => handleSettingClick(PROFILE_SETTINGS_DEFAULT_OPTION)}
              tabbable={isMenuEnabled}
            />
          </li>
          {profileSettings?.map(profileSetting => {
            return (
              <li key={profileSetting.id} role="none">
                <Button
                  type={ButtonType.Text}
                  label={profileSetting.name}
                  role="menuitem"
                  onClick={() => handleSettingClick(profileSetting.id)}
                  tabbable={isMenuEnabled}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
