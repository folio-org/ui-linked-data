import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { CommonStatus } from '@components/CommonStatus';
import { Nav } from '@components/Nav';
import { Loading } from '@components/Loading';
import state from '@state';
import { FIXED_HEIGHT_VIEWS } from '@common/constants/routes.constants';
import classNames from 'classnames';
import { Footer } from '@components/Footer';

export const Root = () => {
  const mainRoutePattern = useRoutePathPattern(['/']);
  const fixedHeightContainerView = useRoutePathPattern(FIXED_HEIGHT_VIEWS);
  const isLoading = useRecoilValue(state.loadingState.isLoading);

  return (
    <div data-testid="root" id="app-root">
      <Nav />
      <CommonStatus />
      <div className={classNames('main-content', { 'no-overflow': fixedHeightContainerView })}>
        <Outlet />

        {mainRoutePattern && (
          <div data-testid="main" className="welcome-screen">
            <FormattedMessage id="marva.welcome" />
          </div>
        )}
      </div>
      <Footer />
      <div id={MODAL_CONTAINER_ID} />

      {isLoading && <Loading />}
    </div>
  );
};
