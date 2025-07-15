import { FC, memo, useState } from 'react';
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
  const [selectedValue, setSelectedValue] = useState<string>();

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedValue) {
      onSubmit(selectedValue);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={formatMessage({ id: 'ld.newInstance' })}
      submitButtonLabel={formatMessage({ id: 'ld.create.base' })}
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      onClose={onClose}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <div className="modal-content" data-testid="modal-choose-profile-content">
        <p>
          <FormattedMessage id="ld.confirmCloseRd" />
        </p>
        <div>
          <label htmlFor="select-profile">
            <FormattedMessage id="ld.resourceProfile" />
          </label>
          <select name={formatMessage({ id: 'ld.resourceProfile' })} id="select-profile" onChange={onChange}>
            {profiles?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            id="choose-profile-set-as-default"
            type="checkbox"
            checked={false}
            onChange={() => {}}
            aria-label={formatMessage({ id: 'ld.modal.chooseResourceProfile.setAsDefault' })}
          />
          <label htmlFor="choose-profile-set-as-default">
            <FormattedMessage id="ld.modal.chooseResourceProfile.setAsDefault" />
          </label>
        </div>
      </div>
    </Modal>
  );
});
