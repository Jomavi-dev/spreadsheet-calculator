import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Navbar, Import, Login, ResultsTable } from './components'
import { PrivateRoute, PublicRoute } from './hocs'

import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Import} />
        <Route path='/courses' exact component={ResultsTable} />
        <PublicRoute path='/login' component={Login} />
        <PrivateRoute path='/todos' component={Login} roles={['user', 'admin']} />
      </Switch>
      <ToastContainer autoClose={3000} />
    </Router>
  )
}

export default App;
