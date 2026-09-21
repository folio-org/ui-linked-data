import { FC, memo, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  PROFILE_SELECTION_LABEL_IDS,
  getProfileSelectionMessageIds,
  getResourceTypeLabelId,
  isProfilePreferred,
} from '@/common/helpers/profileSelection.helper';
import { Modal } from '@/components/Modal';
import { Select, SelectValue } from '@/components/Select';

import { WarningMessages } from './WarningMessages';

import './ModalChooseProfile.scss';

interface ModalChooseProfileProps {
  isOpen: boolean;
  profileSelectionType: ProfileSelectionType;
  onCancel: VoidFunction;
  onSubmit: (profileId: string | number, isDefault?: boolean) => void;
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

    const [isDefault, setIsDefault] = useState(() =>
      isProfilePreferred({ profileId: selectedProfileId ?? profiles?.[0]?.id, preferredProfiles, resourceTypeURL }),
    );

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

    const handleSubmit = () => {
      onSubmit(selectedValue, isDefault);
    };

    const getProfileById = (id: string | number) => {
      return profiles.find(profile => profile.id === id);
    };

    const profileIdToSelectValue = (id: string | number) => {
      return {
        value: id,
        label: getProfileById(id)?.name,
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
