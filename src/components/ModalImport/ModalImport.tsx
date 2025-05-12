import { memo, useState } from 'react';
import { ImportModes } from '@common/constants/import.constants';
import { Dropzone } from '@components/Dropzone';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Select } from '@components/Select';
import { SpinnerEllipsis } from '@components/SpinnerEllipsis';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUIState } from '@src/store';
import { importFile } from '@common/api/import.api';
import './ModalImport.scss';

export const ModalImport = memo(() => {
  const [ importMode, setImportMode ] = useState(ImportModes.JsonFile);
  const [ isImportReady, setIsImportReady ] = useState(false);
  const [ isImportSubmitted, setIsImportSubmitted ] = useState(false);
  const [ isImportCompleted, setIsImportCompleted ] = useState(false);
  const [ isImportSuccessful, setIsImportSuccessful ] = useState(false);
  const [ filesToUpload, setFilesToUpload ] = useState<File[]>([]);
  const { isImportModalOpen, setIsImportModalOpen } = useUIState();
  const { formatMessage } = useIntl();

  const restart = () => {
    setIsImportReady(false);
    setIsImportSubmitted(false);
    setIsImportCompleted(false);
    setIsImportSuccessful(false);
    setFilesToUpload([]);
    setImportMode(ImportModes.JsonFile);
  }

  const reset = () => {
    restart();
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
          // Wait at least long enough to read the loading message for success.
          const started = Date.now();
          await importFile(filesToUpload);
          const elapsed = Date.now() - started;
          const delta = 2500 - elapsed;
          if (delta > 0) {
            await new Promise(r => setTimeout(r, delta));
          }
          setIsImportSuccessful(true);
        } catch (error : any) {
          setIsImportSuccessful(false);
        }
        break;
      case ImportModes.JsonUrl:
        break;
    }
    setIsImportSubmitted(false);
    setIsImportCompleted(true);
  };

  const submitButtonLabel = () => {
    let msg = { id: 'ld.importInstances' };
    if (isImportSuccessful) {
      msg = { id: 'ld.importDone' };
    } else if (isImportCompleted) {
      msg = { id: 'ld.importTryAgain' };
    }
    return formatMessage(msg);
  };

  const onSubmit = () => {
    if (isImportSuccessful) {
      reset();
    } else if (isImportCompleted) {
      restart();
    } else {
      processImport();
    }
  }

  return (
    <Modal
      className='import-file'
      isOpen={isImportModalOpen}
      title={formatMessage({ id: 'ld.importInstances' })}
      submitButtonLabel={submitButtonLabel()}
      submitButtonDisabled={!isImportReady && !isImportCompleted}
      onSubmit={onSubmit}
      alignTitleCenter
      spreadModalControls
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      cancelButtonHidden={isImportSuccessful}
      onCancel={reset}
      onClose={reset}
    >
      <div className='body'>
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
          <div className='submitted'>
            <SpinnerEllipsis />
            <FormattedMessage id='ld.importingFile'/>...
          </div>
        }
        { isImportCompleted &&
          <div className='completed'>
            { isImportSuccessful ?
              <FormattedMessage id='ld.importFileSuccess'/>
              :
              <FormattedMessage id='ld.importFileFailure'/>
            }
          </div>
        }
      </div>
    </Modal>
  );
});