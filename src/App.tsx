import { FC, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { OKAPI_PREFIX } from '@common/constants/api.constants';
import { CommonStatus } from '@components/CommonStatus';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Nav } from '@components/Nav';
import './App.scss';
import { ROUTES } from '@common/constants/routes.constants';
import { Search, Edit, Load, Main } from '@views';

type Okapi = {
  token: string;
  tenant: string;
  url: string;
};

type IContainer = {
  routePrefix?: string;
  okapi?: Okapi;
};

const componentsMap: Record<string, JSX.Element> = {
  [ROUTES.SEARCH.uri]: <Search />,
  [ROUTES.EDIT.uri]: <Edit />,
  [ROUTES.LOAD.uri]: <Load />,
  [ROUTES.MAIN.uri]: <Main />,
};

export const App: FC<IContainer> = ({ routePrefix = '', okapi }) => {
  // TODO: decide on a place to manage okapi props
  // Since we use localStorage might as well manage in the wrapper
  useEffect(() => {
    if (okapi) {
      for (const [key, value] of Object.entries(okapi)) {
        localStorage.setItem(`${OKAPI_PREFIX}_${key}`, value);
      }
    }

    return () => {
      if (okapi) {
        for (const key of Object.keys(okapi)) {
          localStorage.removeItem(`${OKAPI_PREFIX}_${key}`);
        }
      }
    };
  }, [okapi]);

  return (
    <ErrorBoundary>
      <RecoilRoot>
        <BrowserRouter basename={routePrefix}>
          <Nav />
          <CommonStatus />
          <Routes>
            {Object.values(ROUTES).map(({ uri }) => (
              <Route path={uri} element={componentsMap[uri]} key={uri} />
            ))}
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </ErrorBoundary>
  );
};
