import classNames from 'classnames';
import { FC, useState } from 'react';
// import { useDropzone, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage, useIntl } from 'react-intl';
import { MAX_FILE_SIZE_BYTES } from '@common/constants/import.constants';
import { Button, ButtonType } from '@components/Button';
import { DropzoneFile } from './DropzoneFile';
import ErrorIcon from '@src/assets/exclamation-circle.svg?react';
import './Dropzone.scss';

interface Props {
  onImportReady?: (files: File[]) => void;
  onImportNotReady?: () => void;
}

export const Dropzone: FC<Props> = ({ onImportReady, onImportNotReady }) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const { formatMessage } = useIntl();

  const onDropAccepted = (accepted: File[]) => {
    const newFiles = [...acceptedFiles, ...accepted];
    setAcceptedFiles(newFiles);
    if (onImportReady) {
      onImportReady(newFiles);
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
    const newFiles = [...acceptedFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setAcceptedFiles(newFiles);
    if (!hasAcceptedFiles() && onImportNotReady) {
      onImportNotReady();
    }
  };

  const hasAcceptedFiles = () => {
    return acceptedFiles.length > 0;
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

  // Not currently used. Add fileRejections to dropzone results
  // and pass to this method, replacing renderErrors. Not used
  // because the library catches file type incompatibility and
  // returns its own error instead of our generic isDragReject
  // i18n message. For now, all errors result in the same error
  // message.
  /*
  const renderAllErrors = (isDragReject: boolean, rejections: readonly FileRejection[]) => {
    if (isDragReject || rejections.length > 0) {
      if (rejections.length > 0) {
        return rejections.map(({ file, errors }) => {
          return (
            <>
              {errors.map(e => {
                return (
                  <div key={e.code + file.path} className="error">
                    <ErrorIcon className="icon" />
                    {file.path}: {e.message}
                  </div>
                );
              })}
            </>
          );
        });
      } else if (isDragReject) {
        return (
          <div className="error">
            <ErrorIcon className="icon" />
            <FormattedMessage id="ld.importFileTypeError" />
          </div>
        );
      }
    }
    return <></>;
  };
  */

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
        <div className="dropzone-files">
          {acceptedFiles.map((file: File) => {
            return <DropzoneFile key={file.name} {...{ file, onRemoveFile }} />;
          })}
        </div>
      ) : (
        <div
          className={classNames(['dropzone', { dragging: isDragActive }, { waiting: !isDragActive }])}
          {...getRootProps()}
          data-testid="dropzone"
        >
          <input {...getInputProps()} data-testid="dropzone-file-input" />
          {isDragActive ? (
            <div>
              <FormattedMessage id="ld.importFileDrop" />
            </div>
          ) : (
            <div>
              <FormattedMessage id="ld.importFileInstructions" />
              <div className="choose">
                <Button type={ButtonType.Highlighted} onClick={() => {}}>
                  <FormattedMessage id="ld.importFileChoose" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {renderErrors(isDragReject)}
    </div>
  );
};
