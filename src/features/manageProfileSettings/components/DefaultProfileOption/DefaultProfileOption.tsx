import { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useManageProfileSettingsState, useProfileState } from '@/store';
import { usePreferredProfiles } from '../../hooks/usePreferredProfiles';
import { getResourceTypeConfig, getResourceTypeFromURL } from '@/configs/resourceTypes';
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
  const { preferredProfiles } = useProfileState(['preferredProfiles']);
  const { loadPreferredProfiles, preferredProfileForType } = usePreferredProfiles();
  const { formatMessage } = useIntl();

  const handleDefaultChange = () => {
    setIsModified(true);
    setIsTypeDefaultProfile(prev => !prev);
  };

  const getTypeLabel = () => {
    return (
      <>
        {formatMessage({
          id: getResourceTypeConfig(getResourceTypeFromURL(selectedProfile.resourceType)).labelId,
        })}
      </>
    );
  };

  useEffect(() => {
    const initialize = async () => {
      await loadPreferredProfiles();
      if (preferredProfiles) {
        const preferred = preferredProfileForType(selectedProfile.resourceType);
        setIsTypeDefaultProfile(!!preferred && preferred.id === selectedProfile.id);
      } else {
        setIsTypeDefaultProfile(false);
      }
    };

    initialize();
  }, [selectedProfile]);

  return (
    <div className="default-settings">
      <input type="checkbox" checked={isTypeDefaultProfile} onChange={handleDefaultChange} id="type-default" />
      <label htmlFor="type-default">
        <FormattedMessage id="ld.setDefaultTypeProfile" values={{ type: getTypeLabel() }} />
      </label>
    </div>
  );
};
