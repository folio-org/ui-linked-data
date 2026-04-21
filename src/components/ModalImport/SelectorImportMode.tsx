import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { ImportFilterTypes, ImportModes } from '@/common/constants/import.constants';
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
  urlToRetrieve: string | undefined;
  setUrlToRetrieve: (url: string) => void;
  defaultWorkType: string;
  setDefaultWorkType: (workType: string) => void;
  importModalFilterType: ImportFilterTypes;
};

export const SelectorImportMode: FC<SelectorImportModeProps> = ({
  importMode,
  switchMode,
  onImportReady,
  onImportNotReady,
  filesToUpload,
  setFilesToUpload,
  urlToRetrieve,
  setUrlToRetrieve,
  defaultWorkType,
  setDefaultWorkType,
  importModalFilterType,
}) => {
  const description =
    importModalFilterType === ImportFilterTypes.Instance ? (
      <FormattedMessage id="ld.importInstancesDescription" />
    ) : (
      <FormattedMessage id="ld.importHubsDescription" />
    );

  return (
    <>
      <div className="description">{description}</div>
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
          value={importMode}
          withIntl={true}
          className="mode-select"
          onChange={({ value }) => switchMode(value)}
          data-testid="modal-import-mode-selector"
        />
      </div>
      {importMode === ImportModes.JsonFile && (
        <ImportModeFile {...{ onImportReady, onImportNotReady, filesToUpload, setFilesToUpload }} />
      )}
      {importMode === ImportModes.JsonUrl && (
        <ImportModeUrl
          {...{
            onImportReady,
            onImportNotReady,
            urlToRetrieve,
            setUrlToRetrieve,
            defaultWorkType,
            setDefaultWorkType,
            importModalFilterType,
          }}
        />
      )}
    </>
  );
};
