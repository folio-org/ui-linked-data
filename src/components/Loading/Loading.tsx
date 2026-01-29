import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import './Loading.scss';

type LoadingProps = {
  hasLabel?: boolean;
  'data-testid'?: string;
};

export const Loading: FC<LoadingProps> = ({ hasLabel = true, 'data-testid': dataTestId }) => (
  <>
    <div className="loader-overlay" />
    <div className="loader" data-testid={dataTestId}>
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
