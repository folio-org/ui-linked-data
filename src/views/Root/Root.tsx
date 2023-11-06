import { Outlet } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { CommonStatus } from '@components/CommonStatus';
import { Nav } from '@components/Nav';

export const Root = () => {
  const mainRoutePattern = useRoutePathPattern(['/']);

  return (
    <div data-testid="root">
      <Nav />
      <CommonStatus />
      <div className="main-content">
        <Outlet />

        {mainRoutePattern && (
          <div data-testid="main">
            <FormattedMessage id="marva.welcome" />
          </div>
        )}
      </div>
      <div id={MODAL_CONTAINER_ID} />
    </div>
  );
};
