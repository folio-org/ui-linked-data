import { FC, Suspense, useEffect, useRef } from 'react';
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Loading } from '@components/Loading';
import { ROUTES } from '@common/constants/routes.constants';
import { OKAPI_CONFIG } from '@common/constants/api.constants';
import { localStorageService } from '@common/services/storage';
import { Root, Search, Load, EditWrapper, ExternalResourcePreview } from '@views';
import state from '@state';
import { AsyncIntlProvider, ServicesProvider } from './providers';
import './App.scss';

type IContainer = {
  routePrefix?: string;
  config?: Record<string, string | Record<string, string>>;
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.SEARCH.uri} replace />,
      },
      {
        path: ROUTES.SEARCH.uri,
        element: <Search />,
      },
      {
        path: ROUTES.RESOURCE_EDIT.uri,
        element: <EditWrapper />,
      },
      {
        path: ROUTES.RESOURCE_CREATE.uri,
        element: <EditWrapper />,
      },
      {
        path: ROUTES.DASHBOARD.uri,
        element: <Load />,
      },
      {
        path: ROUTES.EXTERNAL_RESOURCE_PREVIEW.uri,
        element: <ExternalResourcePreview />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.SEARCH.uri} replace />, // TODO: create a component for 404 page
      },
    ],
  },
];

const createRouter = (basename: string) => createBrowserRouter(routes, { basename });

const Container: FC<IContainer> = ({ routePrefix = '', config }) => {
  const setCustomEvents = useSetRecoilState(state.config.customEvents);
  const cachedMessages = useRef({});

  useEffect(() => {
    setCustomEvents(config?.customEvents as Record<string, string>);
  }, [config]);

  return (
    <Suspense fallback={<Loading hasLabel={false} />}>
      <AsyncIntlProvider cachedMessages={cachedMessages.current}>
        <ErrorBoundary>
          <ServicesProvider>
            <RouterProvider router={createRouter(routePrefix)} />
          </ServicesProvider>
        </ErrorBoundary>
      </AsyncIntlProvider>
    </Suspense>
  );
};

export const App: FC<IContainer> = ({ routePrefix = '', config }) => {
  useEffect(() => {
    // TODO: localStorage cleanups on unmount (probably has to happen in the wrapper)
    config && localStorageService.serialize(OKAPI_CONFIG, config);
  }, [config]);

  return (
    <RecoilRoot>
      <Container routePrefix={routePrefix} config={config} />
    </RecoilRoot>
  );
};
