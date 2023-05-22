import { FC } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Edit, Load, Main } from './views'
import { Nav } from './components/Nav/Nav'
import { RecoilRoot } from 'recoil'

import './App.scss'

type IApp = {
  // pass base URIs from the wrapper as props here?
  routePrefix?: string,
}

export const App: FC<IApp> = ({
  routePrefix = ''
}) => {
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
