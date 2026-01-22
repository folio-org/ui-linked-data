import { FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BibframeEntitiesMap } from '@/common/constants/bibframe.constants';
import { useManageProfileSettingsState, useProfileState } from '@/store';
import { usePreferredProfiles } from '../../hooks/usePreferredProfiles';
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

  const handleDefaultChange = () => {
    setIsModified(true);
    setIsTypeDefaultProfile(prev => !prev);
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
        <FormattedMessage id="ld.modal.chooseResourceProfile.setAsDefault" />{' '}
        <FormattedMessage
          id={'ld.' + BibframeEntitiesMap[selectedProfile.resourceType as keyof typeof BibframeEntitiesMap]}
        />{' '}
        <FormattedMessage id="ld.profile" />
      </label>
    </div>
  );
};
