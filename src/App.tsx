import { FC, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { IntlProvider } from 'react-intl';
import { CommonStatus } from '@components/CommonStatus';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Nav } from '@components/Nav';
import { MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';
import { ROUTES } from '@common/constants/routes.constants';
import { i18nMessages } from '@common/i18n/messages';
import { Search, Edit, Load, Main } from '@views';
import state from '@state';
import './App.scss';
import { localStorageService } from '@common/services/storage';
import { OKAPI_CONFIG } from '@common/constants/api.constants';

type IContainer = {
  routePrefix?: string;
  config?: string;
};

const componentsMap: Record<string, JSX.Element> = {
  [ROUTES.SEARCH.uri]: <Search />,
  [ROUTES.RESOURCE_EDIT.uri]: <Edit />,
  [ROUTES.RESOURCE_CREATE.uri]: <Edit />,
  [ROUTES.DASHBOARD.uri]: <Load />,
  [ROUTES.MAIN.uri]: <Main />,
};

const Container: FC<IContainer> = ({ routePrefix = '' }) => {
  const locale = useRecoilValue(state.config.locale);

  return (
    <IntlProvider messages={i18nMessages[locale]} locale={locale} defaultLocale="en-US">
      <ErrorBoundary>
        <BrowserRouter basename={routePrefix}>
          <Nav />
          <CommonStatus />
          <div className="main-content">
            <Routes>
              {Object.values(ROUTES).map(({ uri }) => (
                <Route path={uri} element={componentsMap[uri]} key={uri} />
              ))}
            </Routes>
          </div>
          <div id={MODAL_CONTAINER_ID} />
        </BrowserRouter>
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
      <Container routePrefix={routePrefix} />
    </RecoilRoot>
  );
};
