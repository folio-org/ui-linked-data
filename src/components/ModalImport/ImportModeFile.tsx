import { FC } from 'react';
import { Dropzone } from '@components/Dropzone';

type ImportModeFileProps = {
  onImportReady: () => void;
  onImportNotReady: VoidFunction;
  filesToUpload: File[];
  setFilesToUpload: (files: File[]) => void;
};

export const ImportModeFile: FC<ImportModeFileProps> = ({ onImportReady, onImportNotReady, filesToUpload, setFilesToUpload }) => {
  return (
    <div className="mode file-mode" data-testid="modal-import-file-mode">
      <Dropzone files={filesToUpload} setFiles={setFilesToUpload} {...{ onImportReady, onImportNotReady }} />
    </div>
  );
};
