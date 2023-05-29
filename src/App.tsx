import { FC } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Edit, Load, Main } from './views'
import { Nav } from './components/Nav/Nav'
import { RecoilRoot } from 'recoil'

import './App.scss'
import { OKAPI_PREFIX } from './common/constants/api.constants'

type Okapi = {
  token: string,
  tenant: string,
  url: string,
}

type IContainer = {
  routePrefix?: string,
  okapi?: Okapi
}

export const App: FC<IContainer> = ({
  routePrefix = '',
  okapi,
}) => {
  if (okapi) {
    for (const [k, v] of Object.entries(okapi)) {
      localStorage.setItem(`${OKAPI_PREFIX}_${k}`, v)
    }
  }

  return (
    <RecoilRoot>
      <BrowserRouter basename={routePrefix}>
        <Nav />
        <Switch>
          <Route path='/edit' component={Edit} />
          <Route path='/load' component={Load} />
          <Route path='' component={Main} />
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  )
}
