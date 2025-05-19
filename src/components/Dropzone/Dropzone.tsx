import { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage, useIntl } from 'react-intl';
import { MAX_FILE_SIZE_BYTES } from '@common/constants/import.constants';
import { FilesList } from './FilesList';
import { Drop } from './Drop';
import ErrorIcon from '@src/assets/exclamation-circle.svg?react';
import './Dropzone.scss';

interface Props {
  onImportReady?: () => void;
  onImportNotReady?: () => void;
  files: File[];
  setFiles: (files: File[]) => void;
}

export const Dropzone: FC<Props> = ({ onImportReady, onImportNotReady, files, setFiles }) => {
  const { formatMessage } = useIntl();

  const onDropAccepted = (accepted: File[]) => {
    const newFiles = [...files, ...accepted];
    setFiles(newFiles);
    if (onImportReady) {
      onImportReady();
    }
  };

  const validator = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        code: 'file-too-large',
        message: formatMessage({ id: 'ld.importFileSizeError' }),
      };
    }

    return null;
  };

  const onRemoveFile = (file: File) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
    if (!hasAcceptedFiles() && onImportNotReady) {
      onImportNotReady();
    }
  };

  const hasAcceptedFiles = () => {
    return files.length > 0;
  };

  const renderErrors = (rejecting: boolean) => {
    if (rejecting) {
      return (
        <div className="error" data-testid="dropzone-error">
          <ErrorIcon className="icon" />
          <FormattedMessage id="ld.importFileTypeError" />
        </div>
      );
    }
    return <></>;
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    multiple: false,
    accept: {
      'application/json': ['.json'],
    },
    validator,
    onDropAccepted,
  });

  return (
    <div className="dropzone-wrapper" data-testid="dropzone-wrapper">
      {hasAcceptedFiles() ? (
        <FilesList {...{ files, onRemoveFile }} />
      ) : (
        <Drop {...{ getRootProps, getInputProps, isDragActive }} />
      )}
      {renderErrors(isDragReject)}
    </div>
  );
};
