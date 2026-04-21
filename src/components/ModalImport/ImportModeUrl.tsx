import { ChangeEvent, FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { ImportFilterTypes } from '@/common/constants/import.constants';
import { Input } from '@/components/Input';

import { DefaultWorkTypeSelector } from './DefaultWorkTypeSelector';

type ImportModeUrlProps = {
  onImportReady: VoidFunction;
  onImportNotReady: VoidFunction;
  urlToRetrieve: string | undefined;
  setUrlToRetrieve: (url: string) => void;
  defaultWorkType: string;
  setDefaultWorkType: (workType: string) => void;
  importModalFilterType: ImportFilterTypes;
};

export const ImportModeUrl: FC<ImportModeUrlProps> = ({
  onImportReady,
  onImportNotReady,
  urlToRetrieve,
  setUrlToRetrieve,
  defaultWorkType,
  setDefaultWorkType,
  importModalFilterType,
}) => {
  const handleUrlChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value.length > 0) {
      onImportReady();
    } else {
      onImportNotReady();
    }
    setUrlToRetrieve(value);
  };

  return (
    <div className="mode url-mode" data-testid="modal-import-url-mode">
      <label htmlFor="url">
        <FormattedMessage id="ld.importUrlLabel" />
      </label>
      <Input
        data-testid="import-url-input"
        id="url"
        value={urlToRetrieve}
        placeholder="https://"
        onChange={handleUrlChange}
      />

      {importModalFilterType === ImportFilterTypes.Instance && (
        <DefaultWorkTypeSelector {...{ defaultWorkType, setDefaultWorkType }} />
      )}
    </div>
  );
};
