import { FC } from 'react';
import { Button } from '@components/Button';
import Report16 from '@src/assets/report-16.svg?react';
import Trash16 from '@src/assets/trash-16.svg?react';
import './DropzoneFile.scss';

interface Props {
  file: File;
  onRemoveFile: (file: File) => void;
}

export const DropzoneFile: FC<Props> = ({
  file,
  onRemoveFile,
}) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className='dropzone-file'>
      <span className='file-info'>
        <span className='name'>
          <Report16 className='icon' />
          {file.name}
        </span>
        <span className='date'>
          {formatTimestamp(file.lastModified)}
        </span>
      </span>
      <Button
        onClick={() => onRemoveFile(file)}
      >
        <Trash16 />
      </Button>
    </div>
  );
};
