import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Navbar, Import, Login } from './components'
import { PrivateRoute, PublicRoute } from './hocs'

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Import} />
        <PublicRoute path='/login' component={Login} />
        <PrivateRoute path='/todos' component={Login} roles={['user', 'admin']} />
      </Switch>
    </Router>
  )
}

export default App;
