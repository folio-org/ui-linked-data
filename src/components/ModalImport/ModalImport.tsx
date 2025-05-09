import { memo, useState } from 'react';
import { ImportModes } from '@common/constants/import.constants';
import { Dropzone } from '@components/Dropzone';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Select } from '@components/Select';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUIState } from '@src/store';
import './ModalImport.scss';

export const ModalImport = memo(() => {
  const [ importMode, setImportMode ] = useState(ImportModes.JsonFile);
  const { isImportModalOpen, setIsImportModalOpen } = useUIState();
  const { formatMessage } = useIntl();

  const switchMode = (value: string) => {
    setImportMode(value as ImportModes);
    return true;
  };

  return (
    <Modal
      className='import-file'
      isOpen={isImportModalOpen}
      title={formatMessage({ id: 'ld.importInstances' })}
      submitButtonLabel={formatMessage({ id: 'ld.import' })}
      submitButtonDisabled
      alignTitleCenter
      spreadModalControls
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      onCancel={() => setIsImportModalOpen(false)}
      onClose={() => setIsImportModalOpen(false)}
    >
      <div className='description'>
        <FormattedMessage id='ld.importDescription'/>
      </div>
      <div className='selector'>
        <label htmlFor='mode-select'>
          <FormattedMessage id='ld.importOption'/>
        </label>
        <Select 
          id='mode-select'
          options={[
            { value: ImportModes.JsonFile, label: 'importFile'},
            { value: ImportModes.JsonUrl, label: 'importUrl'},
          ]}
          withIntl={true}
          className='mode-select'
          onChange={({value}) => switchMode(value)}/>
      </div>
      { importMode === ImportModes.JsonFile && (
        <div className='mode file-mode'>
          <Dropzone />
        </div>
      )}
      { importMode === ImportModes.JsonUrl && (
        <div className='mode url-mode'>
          <label htmlFor='url'>
            <FormattedMessage id='ld.importUrlLabel'/>
          </label>
          <Input
            id='url'
            onChange={() => {}}
          />
        </div>
      )}
    </Modal>
  );
});