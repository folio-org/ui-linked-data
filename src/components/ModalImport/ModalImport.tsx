import { memo, useState } from 'react';
import { ImportModes, HOLD_LOADING_SCREEN_MS } from '@common/constants/import.constants';
import { Modal } from '@components/Modal';
import { useIntl } from 'react-intl';
import { useUIState } from '@src/store';
import { importFile } from '@common/api/import.api';
import { SelectorImportMode } from './SelectorImportMode';
import { Submitted } from './Submitted';
import { Completed } from './Completed';
import './ModalImport.scss';

export const ModalImport = memo(() => {
  const [importMode, setImportMode] = useState(ImportModes.JsonFile);
  const [isImportReady, setIsImportReady] = useState(false);
  const [isImportSubmitted, setIsImportSubmitted] = useState(false);
  const [isImportCompleted, setIsImportCompleted] = useState(false);
  const [isImportSuccessful, setIsImportSuccessful] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const { isImportModalOpen, setIsImportModalOpen } = useUIState();
  const { formatMessage } = useIntl();

  const restart = () => {
    setIsImportReady(false);
    setIsImportSubmitted(false);
    setIsImportCompleted(false);
    setIsImportSuccessful(false);
    setFilesToUpload([]);
    setImportMode(ImportModes.JsonFile);
  };

  const reset = () => {
    restart();
    setIsImportModalOpen(false);
  };

  const switchMode = (value: string) => {
    setImportMode(value as ImportModes);
    onImportNotReady();
    return true;
  };

  const onImportReady = () => {
    setIsImportReady(true);
  };

  const onImportNotReady = () => {
    setIsImportReady(false);
  };

  const processImport = async () => {
    setIsImportReady(false);
    setIsImportSubmitted(true);
    switch (importMode) {
      case ImportModes.JsonFile:
        try {
          // Wait at least long enough to read the loading message for success.
          const started = Date.now();
          await importFile(filesToUpload);
          const elapsed = Date.now() - started;
          const delta = HOLD_LOADING_SCREEN_MS - elapsed;
          if (delta > 0) {
            await new Promise(r => setTimeout(r, delta));
          }
          setIsImportSuccessful(true);
        } catch {
          setIsImportSuccessful(false);
        }
        break;
      case ImportModes.JsonUrl:
        break;
    }
    setIsImportSubmitted(false);
    setIsImportCompleted(true);
  };

  const title = () => {
    let msg = { id: 'ld.importInstances' };
    if (isImportSuccessful) {
      msg = { id: 'ld.importSuccessful' };
    } else if (isImportCompleted) {
      msg = { id: 'ld.importFailed' };
    }
    return formatMessage(msg);
  };

  const submitButtonLabel = () => {
    let msg = { id: 'ld.import' };
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
  };

  return (
    <Modal
      className="import"
      isOpen={isImportModalOpen}
      title={title()}
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
      <div className="body" data-testid="modal-import">
        {!isImportSubmitted && !isImportCompleted && (
          <SelectorImportMode
            {...{ importMode, switchMode, onImportReady, onImportNotReady, filesToUpload, setFilesToUpload }}
          />
        )}
        {isImportSubmitted && <Submitted />}
        {isImportCompleted && <Completed {...{ isImportSuccessful }} />}
      </div>
    </Modal>
  );
});
