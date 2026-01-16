import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useManageProfileSettingsState } from '@/store';
import { BibframeEntitiesMap } from '@/common/constants/bibframe.constants';
import './ProfileSettings.scss';

export const ProfileSettings = () => {
  const {
    selectedProfile,
    profileSettings,
    setProfileSettings,
    isTypeDefaultProfile,
    setIsTypeDefaultProfile,
    setIsModified,
  } = useManageProfileSettingsState([
    'selectedProfile',
    'profileSettings',
    'setProfileSettings',
    'isTypeDefaultProfile',
    'setIsTypeDefaultProfile',
    'setIsModified',
  ]);

  useEffect(() => {
    // TODO: load type default, profile settings
  }, [setIsTypeDefaultProfile, setProfileSettings]);

  const handleDefaultChange = () => {
    setIsModified(true);
    setIsTypeDefaultProfile(prev => !prev);
  };

  return selectedProfile ? (
    <div data-testid="profile-settings" className="profile-settings">
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          <div className="heading">
            <FormattedMessage
              id={'ld.' + BibframeEntitiesMap[selectedProfile.resourceType as keyof typeof BibframeEntitiesMap]}
            />
            : {selectedProfile.name}
          </div>
          <span className="empty-block" />
        </div>
      </div>

      <div className="default-settings">
        <input type="checkbox" checked={isTypeDefaultProfile} onChange={handleDefaultChange} id="type-default" />
        <label htmlFor="type-default">
          <FormattedMessage id="ld.modal.chooseResourceProfile.setAsDefault" />{' '}
          <FormattedMessage
            id={'ld.' + BibframeEntitiesMap[selectedProfile.resourceType as keyof typeof BibframeEntitiesMap]}
          />{' '}
          <FormattedMessage id="ld.profile" />
        </label>
      </div>

      <hr />

      <div className="settings-option">
        <input
          id="settings-active-default"
          name="settings-active"
          type="radio"
          value="default"
          checked={!profileSettings.active}
        />{' '}
        <label htmlFor="settings-active-default">
          <FormattedMessage id="ld.profileDefault" />
        </label>
        <span className="empty-block" />
        <input
          id="settings-active-custom"
          name="settings-active"
          type="radio"
          value="custom"
          checked={profileSettings.active}
        />{' '}
        <label htmlFor="settings-active-custom">
          <FormattedMessage id="ld.custom" />
        </label>
      </div>
    </div>
  ) : (
    ''
  );
};
