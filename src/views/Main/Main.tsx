import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

export const Main = () => {
  const { formatMessage } = useIntl();

  return (
    <div data-testid='main'>
      <FormattedMessage id='marva.welcome' values={{
        editLink: <Link to="/edit">{
          formatMessage({ id: 'marva.start-editing' })
        }</Link>
      }}/>
    </div>
  );
};
