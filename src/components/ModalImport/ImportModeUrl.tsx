import { Input } from '@components/Input';
import { FormattedMessage } from 'react-intl';

export const ImportModeUrl = () => {
  return (
    <div className='mode url-mode'>
      <label htmlFor='url'>
        <FormattedMessage id='ld.importUrlLabel'/>
      </label>
      <Input
        id='url'
        placeholder='not implemented'
        onChange={() => {}}
      /> 
    </div>
  );
}