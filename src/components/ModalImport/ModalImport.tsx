import { memo, useState } from 'react';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import {
  ImportModes,
  HOLD_LOADING_SCREEN_MS,
  LOADING_TIMEOUT_MS,
  IMPORT_FILE_LOG_MEDIA_TYPE,
  IMPORT_FILE_LOG_NAME,
} from '@common/constants/import.constants';
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
  const [navigationTarget, setNavigationTarget] = useState('');
  const { isImportModalOpen, setIsImportModalOpen } = useUIState();
  const { formatMessage } = useIntl();
  const { navigateToEditPage } = useNavigateToEditPage();

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
    if (navigationTarget !== '') {
      navigateToEditPage(generateEditResourceUrl(navigationTarget));
      setNavigationTarget('');
    }
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

  const doImport = async () => {
    // Reject if importFile is taking too long since we've removed
    // the ability to alter the modal state during load.
    return new Promise<ImportFileResponseDTO>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error(formatMessage({ id: 'ld.importTimedOut' }))),
        LOADING_TIMEOUT_MS,
      );
      importFile(filesToUpload)
        .then(result => {
          resolve(result);
        })
        .catch(e => {
          reject(new Error(e));
        })
        .finally(() => {
          clearTimeout(timeout);
        });
    });
  };

  const downloadLog = (log: string) => {
    const blob = new Blob([log], { type: IMPORT_FILE_LOG_MEDIA_TYPE });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = IMPORT_FILE_LOG_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const processImport = async () => {
    setIsImportReady(false);
    setIsImportSubmitted(true);
    switch (importMode) {
      case ImportModes.JsonFile:
        try {
          // Wait at least long enough to read the loading message for success.
          const started = Date.now();
          const response = await doImport();
          const elapsed = Date.now() - started;
          const delta = HOLD_LOADING_SCREEN_MS - elapsed;
          if (delta > 0) {
            await new Promise(r => setTimeout(r, delta));
          }
          setIsImportSuccessful(true);
          if (response.resources?.length === 1) {
            setNavigationTarget(response.resources[0]);
          }
          downloadLog(response.log);
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
      submitButtonDisabled={!isImportReady && !isImportCompleted}
      submitButtonLabel={submitButtonLabel()}
      onSubmit={onSubmit}
      alignTitleCenter
      spreadModalControls
      cancelButtonDisabled={isImportSubmitted}
      showCloseIconButton={!isImportSubmitted}
      shouldCloseOnEsc={!isImportSubmitted}
      shouldCloseOnExternalClick={!isImportSubmitted}
      cancelButtonHidden={isImportSuccessful}
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
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
