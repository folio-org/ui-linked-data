import { memo, useState } from 'react';
import { ImportModes } from '@common/constants/import.constants';
import { Dropzone } from '@components/Dropzone';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Select } from '@components/Select';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUIState } from '@src/store';
import { importFile } from '@common/api/import.api';
import './ModalImport.scss';

export const ModalImport = memo(() => {
  const [ importMode, setImportMode ] = useState(ImportModes.JsonFile);
  const [ isImportReady, setIsImportReady ] = useState(false);
  const [ isImportSubmitted, setIsImportSubmitted ] = useState(false);
  const [ isImportCompleted, setIsImportCompleted ] = useState(false);
  const [ filesToUpload, setFilesToUpload ] = useState<File[]>([]);
  const { isImportModalOpen, setIsImportModalOpen } = useUIState();
  const { formatMessage } = useIntl();

  const reset = () => {
    setIsImportReady(false);
    setIsImportSubmitted(false);
    setIsImportCompleted(false);
    setFilesToUpload([]);
    setImportMode(ImportModes.JsonFile);
    setIsImportModalOpen(false);
  };

  const switchMode = (value: string) => {
    setImportMode(value as ImportModes);
    onImportNotReady();
    return true;
  };

  const onImportReady = (files: File[]) => {
    setFilesToUpload(files);
    setIsImportReady(true);
  };

  const onImportNotReady = () => {
    setFilesToUpload([]);
    setIsImportReady(false);
  };

  const processImport = async () => {
    setIsImportReady(false);
    setIsImportSubmitted(true);
    switch(importMode) {
      case ImportModes.JsonFile:
        try {
          await importFile(filesToUpload);
        } catch (error : any) {
          // handle error
        }
        break;
      case ImportModes.JsonUrl:
        break;
    }
    setIsImportSubmitted(false);
    setIsImportCompleted(true);
  };

  return (
    <Modal
      className='import-file'
      isOpen={isImportModalOpen}
      title={formatMessage({ id: 'ld.importInstances' })}
      submitButtonLabel={formatMessage({ id: 'ld.import' })}
      submitButtonDisabled={!isImportReady}
      onSubmit={processImport}
      alignTitleCenter
      spreadModalControls
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      onCancel={reset}
      onClose={reset}
    >
      { !isImportSubmitted && !isImportCompleted &&
        <>
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
              <Dropzone {...{onImportReady, onImportNotReady}} />
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
        </>
      }
      { isImportSubmitted &&
        <>
          <FormattedMessage id='ld.importingFile'/> . . .
        </>
      }
      { isImportCompleted &&
        <>
          <FormattedMessage id='ld.importFileSuccess'/>
        </>
      }
    </Modal>
  );
});