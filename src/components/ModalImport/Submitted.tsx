import { SpinnerEllipsis } from '@components/SpinnerEllipsis';
import { FormattedMessage } from 'react-intl';

export const Submitted = () => {
  return (
    <div className="submitted" data-testid="modal-import-waiting">
      <SpinnerEllipsis />
      <FormattedMessage id="ld.importingFile" />
      ...
    </div>
  );
};
