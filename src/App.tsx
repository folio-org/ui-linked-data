import { FC, useEffect } from 'react';
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { IntlProvider } from 'react-intl';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { ROUTES } from '@common/constants/routes.constants';
import { OKAPI_CONFIG } from '@common/constants/api.constants';
import { BASE_LOCALE, i18nMessages } from '@common/i18n/messages';
import { localStorageService } from '@common/services/storage';
import { Root, Search, Load, EditWrapper } from '@views';
import state from '@state';
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
        path: '*',
        element: <Navigate to={ROUTES.SEARCH.uri} replace />, // TODO: create a component for 404 page
      },
    ],
  },
];

const createRouter = (basename: string) => createBrowserRouter(routes, { basename });

const Container: FC<IContainer> = ({ routePrefix = '', config }) => {
  const locale = useRecoilValue(state.config.locale);
  const setCustomEvents = useSetRecoilState(state.config.customEvents);

  useEffect(() => {
    setCustomEvents(config?.customEvents as Record<string, string>);
  }, [config]);

  return (
    <IntlProvider messages={i18nMessages[locale] || BASE_LOCALE} locale={locale} defaultLocale="en-US">
      <ErrorBoundary>
        <RouterProvider router={createRouter(routePrefix)} />
      </ErrorBoundary>
    </IntlProvider>
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
