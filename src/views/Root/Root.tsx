import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { CommonStatus } from '@components/CommonStatus';
import { Nav } from '@components/Nav';
import { Loading } from '@components/Loading';
import state from '@state';

export const Root = () => {
  const mainRoutePattern = useRoutePathPattern(['/']);
  const isLoading = useRecoilValue(state.loadingState.isLoading);

  return (
    <div data-testid="root" id='app-root'>
      <Nav />
      <CommonStatus />
      <div className="main-content">
        <Outlet />

        {mainRoutePattern && (
          <div data-testid="main" className='welcome-screen'>
            <FormattedMessage id="marva.welcome" />
          </div>
        )}
      </div>
      <div id={MODAL_CONTAINER_ID} />

      {isLoading && <Loading />}
    </div>
  );
};
