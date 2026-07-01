import { FC, memo, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { PROFILE_SETTINGS_DEFAULT_OPTION } from '@/common/constants/profileSettings.constants';
import {
  PROFILE_SELECTION_LABEL_IDS,
  getProfileSelectionMessageIds,
  getResourceTypeLabelId,
  isProfilePreferred,
} from '@/common/helpers/profileSelection.helper';
import { Modal } from '@/components/Modal';
import { Select, SelectValue } from '@/components/Select';

import { useLoadProfileSettingsMeta } from '../../hooks';
import { WarningMessages } from './WarningMessages';

import './ModalChooseProfile.scss';

const metaToOption = (meta: ProfileSettingsMeta) => {
  return {
    label: meta.name,
    value: String(meta.id),
  };
};

interface ModalChooseProfileProps {
  isOpen: boolean;
  profileSelectionType: ProfileSelectionType;
  onCancel: VoidFunction;
  onSubmit: (profileId: string | number, profileSettingsId: string | number, isDefault?: boolean) => void;
  onClose: VoidFunction;
  profiles: ProfileDTO[];
  selectedProfileId?: string | number | null;
  preferredProfiles?: ProfileDTO[];
  resourceTypeURL?: ResourceTypeURL;
}

export const ModalChooseProfile: FC<ModalChooseProfileProps> = memo(
  ({
    isOpen,
    profileSelectionType,
    onCancel,
    onSubmit,
    onClose,
    profiles,
    selectedProfileId,
    preferredProfiles,
    resourceTypeURL,
  }) => {
    const { formatMessage } = useIntl();
    const [selectedValue, setSelectedValue] = useState<string | number>(selectedProfileId ?? profiles?.[0]?.id);
    const [selectedSettingsValue, setSelectedSettingsValue] = useState<string | number>(
      PROFILE_SETTINGS_DEFAULT_OPTION,
    );

    const [isDefault, setIsDefault] = useState(() =>
      isProfilePreferred({ profileId: selectedProfileId ?? profiles?.[0]?.id, preferredProfiles, resourceTypeURL }),
    );

    const SETTINGS_OPTION_DEFAULT = [
      {
        label: formatMessage({ id: 'ld.profileSettings.defaultSettings' }),
        value: PROFILE_SETTINGS_DEFAULT_OPTION,
      },
    ];
    const { data: settingsMeta } = useLoadProfileSettingsMeta(selectedValue);
    const settingsMetaOptions = useMemo(() => {
      return settingsMeta ? SETTINGS_OPTION_DEFAULT.concat(settingsMeta.map(metaToOption)) : SETTINGS_OPTION_DEFAULT;
    }, [SETTINGS_OPTION_DEFAULT, settingsMeta]);

    useEffect(() => {
      if (profiles && profiles.length > 0 && !selectedValue) {
        setSelectedValue(profiles[0].id);
      }
    }, [profiles, selectedValue]);

    useEffect(() => {
      if (selectedProfileId) {
        setSelectedValue(selectedProfileId);
        setIsDefault(isProfilePreferred({ profileId: selectedProfileId, preferredProfiles, resourceTypeURL }));
      }
    }, [selectedProfileId, preferredProfiles, resourceTypeURL]);

    const onChange = (selected: SelectValue) => {
      const newValue = selected.value;

      setSelectedValue(newValue);
      setIsDefault(isProfilePreferred({ profileId: newValue, preferredProfiles, resourceTypeURL }));
    };

    const onSettingsChange = (selected: SelectValue) => {
      const newValue = selected.value;

      setSelectedSettingsValue(newValue);
    };

    const handleSubmit = () => {
      onSubmit(selectedValue, selectedSettingsValue, isDefault);
    };

    const getProfileById = (id: string | number) => {
      return profiles.find(profile => profile.id === id);
    };

    const getProfileSettingById = (id: string | number) => {
      return settingsMeta?.find(settingMeta => settingMeta.id === id);
    };

    const profileIdToSelectValue = (id: string | number) => {
      return {
        value: id,
        label: getProfileById(id)?.name,
      } as SelectValue;
    };

    const profileSettingsIdToSelectValue = (id: string | number) => {
      return {
        value: id.toString(),
        label: getProfileSettingById(id)?.name,
      } as SelectValue;
    };

    const profilesAsOptions = () => {
      return profiles?.map(({ id, name }) => {
        return {
          value: id.toString(),
          label: name,
        } as SelectValue;
      }) as SelectValue[];
    };

    const typeLabel = formatMessage({ id: getResourceTypeLabelId(resourceTypeURL) });
    const { titleId, submitId } = getProfileSelectionMessageIds(profileSelectionType);

    const title = formatMessage({ id: titleId }, { type: typeLabel });
    const labelSelect = formatMessage({ id: PROFILE_SELECTION_LABEL_IDS.select }, { type: typeLabel });
    const labelSetAsDefault = formatMessage({ id: PROFILE_SELECTION_LABEL_IDS.setAsDefault }, { type: typeLabel });
    const labelSubmit = formatMessage({ id: submitId });
    const labelSettingsSelect = formatMessage({ id: 'ld.savedSettings' });

    return (
      <Modal
        className="modal-choose-profile"
        isOpen={isOpen}
        title={title}
        submitButtonLabel={labelSubmit}
        cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
        onClose={onClose}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        data-testid="modal-choose-profile-content"
      >
        {profileSelectionType.action === 'set' && (
          <p className="modal-description">
            <FormattedMessage id="ld.modal.chooseResourceProfile.subtitle" />
          </p>
        )}
        <div className="modal-content-controls">
          <div className="modal-content-controls-block">
            <h4 className="modal-content-subheader">{labelSelect}</h4>
            <Select
              name={labelSelect}
              id="select-profile"
              data-testid="select-profile"
              onChange={onChange}
              value={profileIdToSelectValue(selectedValue)}
              options={profilesAsOptions()}
            ></Select>
          </div>
          <div className="modal-content-controls-block">
            <label className="modal-content-label">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={() => {
                  setIsDefault(prev => !prev);
                }}
                name={labelSetAsDefault}
                aria-label={labelSetAsDefault}
              />
              <span>{labelSetAsDefault}</span>
            </label>
          </div>

          {profileSelectionType.action === 'set' && (
            <div className="modal-content-controls-block">
              <h5>{labelSettingsSelect}</h5>
              <Select
                name={labelSettingsSelect}
                id="select-profile-settings"
                data-testid="select-profile-settings"
                onChange={onSettingsChange}
                value={profileSettingsIdToSelectValue(selectedSettingsValue)}
                options={settingsMetaOptions}
                disabled={settingsMetaOptions.length === 1}
              ></Select>
            </div>
          )}

          {profileSelectionType.action === 'change' && (
            <WarningMessages
              profileSelectionType={profileSelectionType}
              profiles={profiles}
              selectedProfileId={selectedProfileId}
              selectedValue={selectedValue}
            />
          )}
        </div>
      </Modal>
    );
  },
);
