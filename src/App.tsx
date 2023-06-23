import { FC, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Edit, Load, Main } from './views';
import { Nav } from './components/Nav/Nav';
import { RecoilRoot } from 'recoil';

import './App.scss';
import { OKAPI_PREFIX } from './common/constants/api.constants';

type Okapi = {
  token: string;
  tenant: string;
  url: string;
};

type IContainer = {
  routePrefix?: string;
  okapi?: Okapi;
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
    <RecoilRoot>
      <BrowserRouter basename={routePrefix}>
        <Nav />
        <Switch>
          <Route path="/edit" component={Edit} />
          <Route path="/load" component={Load} />
          <Route path="" component={Main} />
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  );
};
