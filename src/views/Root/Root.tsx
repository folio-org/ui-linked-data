import { Outlet } from 'react-router-dom';

import classNames from 'classnames';

import { FIXED_HEIGHT_VIEWS } from '@/common/constants/routes.constants';
import { MODAL_CONTAINER_ID } from '@/common/constants/uiElements.constants';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { Loading } from '@/components/Loading';
import { ProfileSelectionManager } from '@/components/ProfileSelectionManager';

import { useLoadingState } from '@/store';

import { CommonStatus } from './components/CommonStatus';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';

export const Root = () => {
  const fixedHeightContainerView = useRoutePathPattern(FIXED_HEIGHT_VIEWS);
  const { isLoading } = useLoadingState(['isLoading']);

  return (
    <div data-testid="root" id="app-root">
      <Nav />
      <CommonStatus />
      <div className={classNames('main-content', { 'no-overflow': fixedHeightContainerView })}>
        <Outlet />
      </div>
      <Footer />
      <ProfileSelectionManager />
      <div id={MODAL_CONTAINER_ID} />

      {isLoading && <Loading />}
    </div>
  );
};
