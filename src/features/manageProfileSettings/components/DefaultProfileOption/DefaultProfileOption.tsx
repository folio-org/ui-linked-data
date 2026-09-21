import { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { getProfileLabelId, getResourceTypeFromURL } from '@/configs/resourceTypes';

import { usePreferredProfiles } from '@/features/profiles';

import { useManageProfileSettingsState } from '@/store';

import './DefaultProfileOption.scss';

type DefaultProfileOptionProps = {
  selectedProfile: ProfileDTO;
};

export const DefaultProfileOption: FC<DefaultProfileOptionProps> = ({ selectedProfile }) => {
  const { isTypeDefaultProfile, setIsTypeDefaultProfile, setIsModified } = useManageProfileSettingsState([
    'isTypeDefaultProfile',
    'setIsTypeDefaultProfile',
    'setIsModified',
  ]);
  const { loadPreferredProfiles, preferredProfileForType } = usePreferredProfiles();
  const { formatMessage } = useIntl();

  const handleDefaultChange = () => {
    setIsModified(true);
    setIsTypeDefaultProfile(prev => !prev);
  };

  const getTypeLabel = () => {
    return (
      <span key="type-label">
        {formatMessage({
          id: getProfileLabelId(getResourceTypeFromURL(selectedProfile.resourceType as ResourceTypeURL)),
        })}
      </span>
    );
  };

  useEffect(() => {
    const initialize = async () => {
      const preferredProfiles = await loadPreferredProfiles();
      if (preferredProfiles?.length) {
        const preferred = preferredProfileForType(selectedProfile.resourceType, preferredProfiles);
        setIsTypeDefaultProfile(!!preferred && preferred.id.toString() === selectedProfile.id.toString());
      } else {
        setIsTypeDefaultProfile(false);
      }
    };

    initialize();
  }, [selectedProfile]);

  return (
    <div className="default-settings">
      <label htmlFor="type-default-setting">
        <input
          type="checkbox"
          checked={isTypeDefaultProfile}
          onChange={handleDefaultChange}
          id="type-default-setting"
          data-testid="type-default-setting"
        />
        <FormattedMessage id="ld.setDefaultTypeProfile" values={{ type: getTypeLabel() }} />
      </label>
    </div>
  );
};
