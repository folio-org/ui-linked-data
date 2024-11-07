import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import './Loading.scss';

type LoadingProps = {
  hasLabel?: boolean;
};

export const Loading: FC<LoadingProps> = ({ hasLabel = true }) => (
  <>
    <div className="loader-overlay" />
    <div className="loader">
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>

      {hasLabel && (
        <span className="loading-label">
          <FormattedMessage id="ld.loading" />
        </span>
      )}
    </div>
  </>
);
