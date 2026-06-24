import { ChangeEvent, FC, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';

import { useSaveProfileSettings } from '../../hooks';

import './ModalCreateSavedSetting.scss';

type ModalCreateSavedSettingProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ModalCreateSavedSetting: FC<ModalCreateSavedSettingProps> = ({ isOpen, setIsOpen }) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [name, setName] = useState('');
  const { formatMessage } = useIntl();
  const { saveSettings } = useSaveProfileSettings();

  const handleNameChange = (evt: ChangeEvent<HTMLInputElement, Element>) => {
    setName(evt.target.value);
  };

  const handleClose = () => {
    setName('');
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    await saveSettings(name);
    handleClose();
  };

  useEffect(() => {
    setIsEmpty(name.length === 0);
  }, [name]);

  return (
    <Modal
      data-testid="modal-create-saved-setting"
      className="modal-create-saved-setting"
      isOpen={isOpen}
      onClose={handleClose}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      title={<FormattedMessage id="ld.profileSettings.createSavedSetting" />}
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      submitButtonLabel={formatMessage({ id: 'ld.create.base' })}
      submitButtonDisabled={isEmpty}
    >
      <p>Provide a name for these saved profile settings.</p>
      <p>
        <label>
          Name
          <Input value={name} onChange={handleNameChange} />
        </label>
      </p>
    </Modal>
  );
};
