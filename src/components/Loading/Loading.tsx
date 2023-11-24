import { FormattedMessage } from 'react-intl';
import './Loading.scss';

export const Loading = () => (
  <>
    <div className="loader-overlay" />
    <div className="loader">
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
      <span className="loading-label">
        <FormattedMessage id="marva.loading" />
      </span>
    </div>
  </>
);
