import { FC, memo, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import './ModalChooseProfile.scss';

interface Props {
  isOpen: boolean;
  onCancel: VoidFunction;
  onSubmit: (id: string) => void;
  onClose: VoidFunction;
  profiles: ProfileDTO[];
}

export const ModalChooseProfile: FC<Props> = memo(({ isOpen, onCancel, onSubmit, onClose, profiles }) => {
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

  const labelSetAsDefault = formatMessage({ id: 'ld.modal.chooseResourceProfile.setAsDefault' });

  return (
    <Modal
      className="modal-choose-profile"
      isOpen={isOpen}
      title={formatMessage({ id: 'ld.newInstance' })}
      submitButtonLabel={formatMessage({ id: 'ld.create.base' })}
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
            <h4 className="modal-content-subheader">
              <FormattedMessage id="ld.resourceProfile" />
            </h4>
            <select
              name={formatMessage({ id: 'ld.resourceProfile' })}
              id="select-profile"
              onChange={onChange}
              value={selectedValue}
            >
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
              <span>
                <FormattedMessage id="ld.modal.chooseResourceProfile.setAsDefault" />
              </span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
});
