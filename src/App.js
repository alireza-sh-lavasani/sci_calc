import { LinearProgress } from '@material-ui/core'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Sandbox from './components/Sandbox'

const ABlue = lazy(() => import('./components/Calculator'))

const App = () => (
  <BrowserRouter>
    <Suspense fallback={() => <LinearProgress />}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/ablue' component={ABlue} />
        <Route path='/sandbox' component={Sandbox} />
      </Switch>
    </Suspense>
  </BrowserRouter>
)

export default App
