import { FC } from 'react';

import { DropzoneFile } from './DropzoneFile';

interface Props {
  files: File[];
  onRemoveFile: (file: File) => void;
}

export const FilesList: FC<Props> = ({ files, onRemoveFile }) => {
  return (
    <div className="dropzone-files">
      {files.map((file: File) => {
        return <DropzoneFile key={file.name} {...{ file, onRemoveFile }} />;
      })}
    </div>
  );
};
