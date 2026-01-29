import { FormattedMessage } from 'react-intl';

import { SpinnerEllipsis } from '@/components/SpinnerEllipsis';

export const Submitted = () => {
  return (
    <div className="submitted" data-testid="modal-import-waiting">
      <SpinnerEllipsis />
      <FormattedMessage id="ld.importingFile" />
      ...
    </div>
  );
};
