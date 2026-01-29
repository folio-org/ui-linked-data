import { FormattedMessage } from 'react-intl';

import { Input } from '@/components/Input';

export const ImportModeUrl = () => {
  return (
    <div className="mode url-mode" data-testid="modal-import-url-mode">
      <label htmlFor="url">
        <FormattedMessage id="ld.importUrlLabel" />
      </label>
      <Input id="url" placeholder="not implemented" onChange={() => {}} />
    </div>
  );
};
