import { FC } from 'react';
import { Dropzone } from '@components/Dropzone';

type ImportModeFileProps = {
  onImportReady: (files: File[]) => void;
  onImportNotReady: VoidFunction;
};

export const ImportModeFile: FC<ImportModeFileProps> = ({ onImportReady, onImportNotReady }) => {
  return (
    <div className="mode file-mode" data-testid="modal-import-file-mode">
      <Dropzone {...{ onImportReady, onImportNotReady }} />
    </div>
  );
};
