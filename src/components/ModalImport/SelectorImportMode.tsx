import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { ImportModes } from '@/common/constants/import.constants';
import { Select } from '@/components/Select';

import { ImportModeFile } from './ImportModeFile';
import { ImportModeUrl } from './ImportModeUrl';

type SelectorImportModeProps = {
  importMode: ImportModes;
  switchMode: (value: string) => boolean;
  onImportReady: () => void;
  onImportNotReady: VoidFunction;
  filesToUpload: File[];
  setFilesToUpload: (files: File[]) => void;
};

export const SelectorImportMode: FC<SelectorImportModeProps> = ({
  importMode,
  switchMode,
  onImportReady,
  onImportNotReady,
  filesToUpload,
  setFilesToUpload,
}) => {
  return (
    <>
      <div className="description">
        <FormattedMessage id="ld.importDescription" />
      </div>
      <div className="selector">
        <label htmlFor="mode-select">
          <FormattedMessage id="ld.importOption" />
        </label>
        <Select
          id="mode-select"
          options={[
            { value: ImportModes.JsonFile, label: 'importFile' },
            { value: ImportModes.JsonUrl, label: 'importUrl' },
          ]}
          withIntl={true}
          className="mode-select"
          onChange={({ value }) => switchMode(value)}
          data-testid="modal-import-mode-selector"
        />
      </div>
      {importMode === ImportModes.JsonFile && (
        <ImportModeFile {...{ onImportReady, onImportNotReady, filesToUpload, setFilesToUpload }} />
      )}
      {importMode === ImportModes.JsonUrl && <ImportModeUrl />}
    </>
  );
};
