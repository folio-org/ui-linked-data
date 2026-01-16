import { FC, Suspense, useEffect, useMemo, useRef } from 'react';
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Loading } from '@components/Loading';
import { ROUTES } from '@common/constants/routes.constants';
import { DEFAULT_LOCALE } from '@common/constants/i18n.constants';
import { OKAPI_CONFIG } from '@common/constants/api.constants';
import { localStorageService } from '@common/services/storage';
import { Root, Search, EditWrapper, ExternalResourcePreview } from '@views';
import en from '../translations/ui-linked-data/en.json';
import { AsyncIntlProvider, QueryProvider, ServicesProvider } from './providers';
import './App.scss';
import { useConfigState } from './store';

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
        path: ROUTES.EXTERNAL_RESOURCE_PREVIEW.uri,
        element: <ExternalResourcePreview />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.SEARCH.uri} replace />, // TODO: UILD-441 - create a component for 404 page
      },
    ],
  },
];

const createRouter = (basename: string) => createBrowserRouter(routes, { basename });

const Container: FC<IContainer> = ({ routePrefix = '', config }) => {
  const { setCustomEvents, setHasNavigationOrigin } = useConfigState(['setCustomEvents', 'setHasNavigationOrigin']);
  const cachedMessages = useRef({ [DEFAULT_LOCALE]: en });
  const router = useMemo(() => createRouter(routePrefix), [routePrefix]);

  useEffect(() => {
    setCustomEvents(config?.customEvents as Record<string, string>);
    config?.navigationOrigin && setHasNavigationOrigin(true);
  }, [config]);

  return (
    <Suspense fallback={<Loading hasLabel={false} data-testid="loading" />}>
      <AsyncIntlProvider cachedMessages={cachedMessages.current}>
        <ErrorBoundary>
          <QueryProvider>
            <ServicesProvider>
              <RouterProvider router={router} />
            </ServicesProvider>
          </QueryProvider>
        </ErrorBoundary>
      </AsyncIntlProvider>
    </Suspense>
  );
};

export const App: FC<IContainer> = ({ routePrefix = '', config }) => {
  useEffect(() => {
    // TODO: UILD-440 - localStorage cleanups on unmount (probably has to happen in the wrapper)
    config && localStorageService.serialize(OKAPI_CONFIG, config);
  }, [config]);

  return <Container routePrefix={routePrefix} config={config} />;
};
