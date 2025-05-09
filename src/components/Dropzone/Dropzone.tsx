import classNames from 'classnames';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';
import './Dropzone.scss';

export const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles : File[]) => {
    // TODO placeholder
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
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
  )
};
