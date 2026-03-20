import { ChangeEvent, FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { WORK_TYPES } from '@/common/constants/bibframe.constants';
import { ImportFilterTypes } from '@/common/constants/import.constants';
import { Input } from '@/components/Input';
import { Select, SelectValue } from '@/components/Select';

type ImportModeUrlProps = {
  onImportReady: () => void;
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

  const handleWorkTypeChange = ({ value }: SelectValue) => {
    setDefaultWorkType(value);
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
        <>
          <label id="default-work-type-label" htmlFor="default-work-type">
            <FormattedMessage id="ld.importDefaultWorkType" />
          </label>
          <Select
            data-testid="default-work-type"
            id="default-work-type"
            options={WORK_TYPES.map(workType => {
              return {
                label: workType.label,
                value: workType.uri,
                isDisabled: false,
              };
            })}
            value={defaultWorkType}
            withIntl={true}
            ariaLabelledBy="default-work-type-label"
            onChange={handleWorkTypeChange}
          />
        </>
      )}
    </div>
  );
};
