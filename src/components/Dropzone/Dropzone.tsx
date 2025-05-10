import classNames from 'classnames';
import { FC, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FormattedMessage, useIntl } from 'react-intl';
import { MAX_FILE_SIZE_BYTES } from '@common/constants/import.constants';
import { Button, ButtonType } from '@components/Button';
import { DropzoneFile } from '@components/DropzoneFile';
import ErrorIcon from '@src/assets/exclamation-circle.svg?react';
import './Dropzone.scss';

interface Props {
  onImportReady?: (files: File[]) => void;
  onImportNotReady?: () => void;
};

export const Dropzone: FC<Props> = ({
  onImportReady,
  onImportNotReady
}) => {
  const [ acceptedFiles, setAcceptedFiles ] = useState<File[]>([]);
  const { formatMessage } = useIntl();

  const onDropAccepted = (accepted : File[]) => {
    const newFiles = [...acceptedFiles, ...accepted]
    setAcceptedFiles(newFiles);
    if (onImportReady) {
      onImportReady(newFiles);
    }
  };

  const validator = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        code: 'file-too-large',
        message: formatMessage({ id: 'ld.importFileSizeError' })
      };
    }

    return null;
  };

  const onRemoveFile = (file : File) => {
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

  const renderErrors = (isDragReject: boolean, rejections: readonly FileRejection[]) => {
    if (isDragReject || rejections.length > 0) {
      if (rejections.length > 0) {
        return (
          rejections.map(({ file, errors }) => {
            return <>
              {errors.map((e) => {
                return <div key={e.code + file.path} className='error'>
                  <ErrorIcon className='icon'/>
                  {file.path}: {e.message}
                </div>
              })}
            </>
          })
        );
      } else if (isDragReject) {
        return (
          <div className='error'>
            <ErrorIcon className='icon'/>
            <FormattedMessage id='ld.importFileTypeError'/>
          </div>
        );
      }
    }
    return <></>;
  };

  const {
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    multiple: false,
    accept: {
      "application/json": [".json"]
    },
    validator,
    onDropAccepted
  });

  return (
    <div className='dropzone-wrapper'>
      {
        hasAcceptedFiles() ?
        <div className='dropzone-files'>
          {acceptedFiles.map((file: File) => {
            return <DropzoneFile key={file.name} {...{file, onRemoveFile}} />
          })}
        </div>
        :
        <div className={classNames(['dropzone',
          { 'dragging' : isDragActive },
          { 'waiting' : !isDragActive }
        ])} {...getRootProps()}>
          <input {...getInputProps()}/>
          {
            isDragActive ?
              <div>
                <FormattedMessage id='ld.importFileDrop'/>
              </div>
              :
              <div>
                <FormattedMessage id='ld.importFileInstructions'/>
                <div className='choose'>
                  <Button
                    type={ButtonType.Highlighted}
                    onClick={() => {}}>
                    <FormattedMessage id='ld.importFileChoose'/>
                  </Button>
                </div>
              </div>
          }
        </div>
      }
      {renderErrors(isDragReject, fileRejections)}
    </div>
  )
};
