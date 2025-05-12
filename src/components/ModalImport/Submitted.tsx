import { SpinnerEllipsis } from '@components/SpinnerEllipsis';
import { FormattedMessage } from 'react-intl';

export const Submitted = () => {
  return (
    <div className='submitted'>
      <SpinnerEllipsis />
      <FormattedMessage id='ld.importingFile'/>...
    </div>
  );
};