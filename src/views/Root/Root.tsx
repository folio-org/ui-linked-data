import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { FIXED_HEIGHT_VIEWS, RESOURCE_EDIT_CREATE_URLS } from '@common/constants/routes.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { CommonStatus } from '@components/CommonStatus';
import { Nav } from '@components/Nav';
import { Loading } from '@components/Loading';
import { Footer } from '@components/Footer';
import state from '@state';

export const Root = () => {
  const fixedHeightContainerView = useRoutePathPattern(FIXED_HEIGHT_VIEWS);
  const isLoading = useRecoilValue(state.loadingState.isLoading);
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);

  return (
    <div data-testid="root" id="app-root">
      {isEditSectionOpen && <Nav />}
      <CommonStatus />
      <div className={classNames('main-content', { 'no-overflow': fixedHeightContainerView })}>
        <Outlet />
      </div>
      <Footer />
      <div id={MODAL_CONTAINER_ID} />

      {isLoading && <Loading />}
    </div>
  );
};
