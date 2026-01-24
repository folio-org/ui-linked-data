import { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useManageProfileSettingsState } from '@/store';
import { usePreferredProfiles } from '../../hooks/usePreferredProfiles';
import { getProfileLabelId, getResourceTypeFromURL } from '@/configs/resourceTypes';
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
      <>
        {formatMessage({
          id: getProfileLabelId(getResourceTypeFromURL(selectedProfile.resourceType)),
        })}
      </>
    );
  };

  useEffect(() => {
    const initialize = async () => {
      const preferredProfiles = await loadPreferredProfiles();
      if (preferredProfiles?.length) {
        const preferred = preferredProfileForType(selectedProfile.resourceType, preferredProfiles);
        setIsTypeDefaultProfile(!!preferred && preferred.id === selectedProfile.id);
      } else {
        setIsTypeDefaultProfile(false);
      }
    };

    initialize();
  }, [selectedProfile]);

  return (
    <div className="default-settings">
      <input
        type="checkbox"
        checked={isTypeDefaultProfile}
        onChange={handleDefaultChange}
        id="type-default-setting"
        data-testid="type-default-setting"
      />
      <label htmlFor="type-default-setting">
        <FormattedMessage id="ld.setDefaultTypeProfile" values={{ type: getTypeLabel() }} />
      </label>
    </div>
  );
};
