import { FC, memo, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import './ModalChooseProfile.scss';

interface Props {
  isOpen: boolean;
  profileSelectionType: ProfileSelectionType;
  onCancel: VoidFunction;
  onSubmit: (id: string) => void;
  onClose: VoidFunction;
  profiles: ProfileDTO[];
}

const getLabelId = ({
  labels: { workChange, instanceChange, defaultSet },
  profileSelectionType: { action, resourceType },
}: {
  labels: {
    workChange: string;
    instanceChange: string;
    defaultSet: string;
  };
  profileSelectionType: ProfileSelectionType;
}) => {
  let labelId;

  if (action === 'change') {
    labelId = resourceType === 'work' ? workChange : instanceChange;
  } else {
    labelId = defaultSet;
  }

  return labelId;
};

export const ModalChooseProfile: FC<Props> = memo(
  ({ isOpen, profileSelectionType, onCancel, onSubmit, onClose, profiles }) => {
    const { formatMessage } = useIntl();
    const [selectedValue, setSelectedValue] = useState<string>(profiles?.[0]?.id);
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
      if (profiles && profiles.length > 0 && !selectedValue) {
        setSelectedValue(profiles[0].id);
      }
    }, [profiles, selectedValue]);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(event.target.value);
    };

    const handleSubmit = () => {
      onSubmit(selectedValue);
    };

    const labelSelect = formatMessage({
      id: getLabelId({
        labels: {
          workChange: 'ld.modal.chooseResourceProfile.workProfile',
          instanceChange: 'ld.modal.chooseResourceProfile.instanceProfile',
          defaultSet: 'ld.resourceProfile',
        },
        profileSelectionType,
      }),
    });
    const labelSetAsDefault = formatMessage({
      id: getLabelId({
        labels: {
          workChange: 'ld.modal.chooseResourceProfile.setDefaultWorkProfile',
          instanceChange: 'ld.modal.chooseResourceProfile.setDefaultInstanceProfile',
          defaultSet: 'ld.modal.chooseResourceProfile.setAsDefault',
        },
        profileSelectionType,
      }),
    });
    const labelSubmit = formatMessage({ id: profileSelectionType.action === 'set' ? 'ld.create.base' : 'ld.change' });

    return (
      <Modal
        className="modal-choose-profile"
        isOpen={isOpen}
        title={formatMessage({ id: 'ld.newInstance' })}
        submitButtonLabel={labelSubmit}
        cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
        onClose={onClose}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      >
        <div className="modal-content" data-testid="modal-choose-profile-content">
          <p className="modal-description">
            <FormattedMessage id="ld.modal.chooseResourceProfile.subtitle" />
          </p>
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
              <div>
                <p>Change profiles warning</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  },
);
