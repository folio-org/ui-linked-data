import { FC } from 'react';
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

type IContainer = {
  routePrefix?: string;
};

const componentsMap: Record<string, JSX.Element> = {
  [ROUTES.SEARCH.uri]: <Search />,
  [ROUTES.EDIT.uri]: <Edit />,
  [ROUTES.LOAD.uri]: <Load />,
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
          <Routes>
            {Object.values(ROUTES).map(({ uri }) => (
              <Route path={uri} element={componentsMap[uri]} key={uri} />
            ))}
          </Routes>
          <div id={MODAL_CONTAINER_ID} />
        </BrowserRouter>
      </ErrorBoundary>
    </IntlProvider>
  );
};

export const App: FC<IContainer> = ({ routePrefix = '' }) => (
  <RecoilRoot>
    <Container routePrefix={routePrefix} />
  </RecoilRoot>
);
