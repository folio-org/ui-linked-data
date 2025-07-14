import { FC, memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import './ModalChooseProfile.scss';

interface Props {
  isOpen: boolean;
  onCancel: VoidFunction;
  onSubmit: VoidFunction;
  onClose: VoidFunction;
  profiles: ProfileDTO[];
  onSelectProfile: (id: number) => void;
}

export const ModalChooseProfile: FC<Props> = memo(
  ({ isOpen, onCancel, onSubmit, onClose, profiles, onSelectProfile }) => {
    const { formatMessage } = useIntl();

    const onChange = (event: any) => {
      console.log('====================================');
      console.log('onSelect', event.target.value);
      console.log('====================================');
    };

    return (
      <Modal
        isOpen={isOpen}
        title={formatMessage({ id: 'ld.newInstance' })}
        submitButtonLabel={formatMessage({ id: 'ld.create.base' })}
        cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
        onClose={onClose}
        onSubmit={onSubmit}
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
  },
);
