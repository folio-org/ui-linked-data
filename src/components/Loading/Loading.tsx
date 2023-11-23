import { createPortal } from 'react-dom';
import { LOADING_CONTAINER_ID } from '@common/constants/uiElements.constants';
import './Loading.scss';
import { FormattedMessage } from 'react-intl';

export const Loading = () => {
  const portalElement = document.getElementById(LOADING_CONTAINER_ID) as Element;

  return (
    <>
      {portalElement &&
        createPortal(
          <>
            <div className="overlay" />
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
          </>,
          portalElement,
        )}
    </>
  );
};
