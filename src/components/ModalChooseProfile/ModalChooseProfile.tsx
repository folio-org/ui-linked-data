import { FC, memo, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getLabelId } from '@common/helpers/profileSelection.helper';
import { Modal } from '@components/Modal';
import { WarningMessages } from './WarningMessages';
import './ModalChooseProfile.scss';

interface ModalChooseProfileProps {
  isOpen: boolean;
  profileSelectionType: ProfileSelectionType;
  onCancel: VoidFunction;
  onSubmit: (id: string | number) => void;
  onClose: VoidFunction;
  profiles: ProfileDTO[];
  selectedProfileId?: string | number | null;
}

export const ModalChooseProfile: FC<ModalChooseProfileProps> = memo(
  ({ isOpen, profileSelectionType, onCancel, onSubmit, onClose, profiles, selectedProfileId }) => {
    const { formatMessage } = useIntl();
    const [selectedValue, setSelectedValue] = useState<string | number>(selectedProfileId ?? profiles?.[0]?.id);
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
      if (profiles && profiles.length > 0 && !selectedValue) {
        setSelectedValue(profiles[0].id);
      }
    }, [profiles, selectedValue]);

    useEffect(() => {
      if (selectedProfileId) {
        setSelectedValue(selectedProfileId);
      }
    }, [selectedProfileId]);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(event.target.value);
    };

    const handleSubmit = () => {
      onSubmit(selectedValue);
    };

    const title = formatMessage({
      id: getLabelId({
        labels: {
          workChange: 'ld.changeWorkProfile',
          instanceChange: 'ld.changeInstanceProfile',
          workSet: 'ld.newWork',
          instanceSet: 'ld.newInstance',
          defaultLabel: 'ld.newInstance',
        },
        profileSelectionType,
      }),
    });
    const labelSelect = formatMessage({
      id: getLabelId({
        labels: {
          workChange: 'ld.modal.chooseResourceProfile.workProfile',
          instanceChange: 'ld.modal.chooseResourceProfile.instanceProfile',
          defaultLabel: 'ld.resourceProfile',
        },
        profileSelectionType,
      }),
    });
    const labelSetAsDefault = formatMessage({
      id: getLabelId({
        labels: {
          workChange: 'ld.modal.chooseResourceProfile.setDefaultWorkProfile',
          instanceChange: 'ld.modal.chooseResourceProfile.setDefaultInstanceProfile',
          defaultLabel: 'ld.modal.chooseResourceProfile.setAsDefault',
        },
        profileSelectionType,
      }),
    });
    const labelSubmit = formatMessage({ id: profileSelectionType.action === 'set' ? 'ld.create.base' : 'ld.change' });

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
        submitButtonDisabled={profileSelectionType.action === 'change'}
      >
        <div className="modal-content" data-testid="modal-choose-profile-content">
          {profileSelectionType.action === 'set' && (
            <p className="modal-description">
              <FormattedMessage id="ld.modal.chooseResourceProfile.subtitle" />
            </p>
          )}
          <div className="modal-content-controls">
            <div className="modal-content-controls-block">
              <h4 className="modal-content-subheader">{labelSelect}</h4>
              <select name={labelSelect} id="select-profile" onChange={onChange} value={selectedValue}>
                {profiles?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
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
        </div>
      </Modal>
    );
  },
);
