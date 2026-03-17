import { ChangeEvent, FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Input } from '@/components/Input';

type ImportModeUrlProps = {
  onImportReady: () => void;
  onImportNotReady: VoidFunction;
  urlToRetrieve: string | undefined;
  setUrlToRetrieve: (url: string) => void;
};

export const ImportModeUrl: FC<ImportModeUrlProps> = ({
  onImportReady,
  onImportNotReady,
  urlToRetrieve,
  setUrlToRetrieve,
}) => {
  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
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
      <Input id="url" value={urlToRetrieve} placeholder="https://" onChange={handleChange} />
    </div>
  );
};
