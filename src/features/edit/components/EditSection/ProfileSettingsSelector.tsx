import { useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const { formatMessage } = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const { record } = useInputsState(['record']);
  const { selectedProfileSettingsId, setSelectedProfileSettingsId } = useProfileState([
    'selectedProfileSettingsId',
    'setSelectedProfileSettingsId',
  ]);
  const recordProfileId = getRecordProfileId(record);
  const profileIdParam = searchParams.get(QueryParams.ProfileId);
  const selectedProfileId = recordProfileId ?? profileIdParam;
  const basicOption = [
    {
      id: PROFILE_SETTINGS_DEFAULT_OPTION,
      name: formatMessage({ id: 'ld.profileDefaults' }),
    },
  ] as ProfileSettingsMetaList;
  const { data: profileSettings } = useLoadProfileSettingsMeta(selectedProfileId);
  const profileSettingsOptions = useMemo(() => {
    return profileSettings ? basicOption.concat(profileSettings) : basicOption;
  }, [basicOption, profileSettings]);

  const { isOpen: isMenuEnabled, setIsOpen: setIsMenuEnabled, toggle: toggleIsMenuEnabled } = useDismissMenu(ref);

  const handleSettingClick = async (profileSettingsId: string | number) => {
    setIsMenuEnabled(false);
    setSelectedProfileSettingsId(profileSettingsId.toString());
  };

  return (
    <div className="profile-settings-selector" ref={ref}>
      <Button ariaHaspopup="menu" ariaExpanded={isMenuEnabled} onClick={toggleIsMenuEnabled}>
        <Settings />
      </Button>
      {isMenuEnabled && (
        <ul
          data-testid="profile-settings-selector-menu"
          className="profile-settings-selector-menu"
          role="menu" // NOSONAR
          aria-labelledby="selector-title"
        >
          <li id="selector-title" role="none">
            <FormattedMessage id="ld.applyProfileSettings" />
          </li>
          {profileSettingsOptions?.map(profileSetting => {
            return (
              <li key={profileSetting.id} role="none">
                <Button
                  type={ButtonType.Text}
                  label={profileSetting.name}
                  role="menuitem"
                  disabled={profileSetting.id.toString() === selectedProfileSettingsId}
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
