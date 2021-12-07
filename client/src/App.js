import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Navbar, Upload } from './components'
import { PrivateRoute, PublicRoute } from './hocs'

function Test() {
  return (
    <div class="p-6 mt-10 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div class="flex-shrink-0"><img class="h-12 w-12" src="/img/logo.svg" alt="" /></div>
      <div>
        <div class="text-xl font-medium text-black">ChitChat</div>
        <p class="text-gray-500">You have a new message!</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Upload} />
        <PublicRoute path='/login' component={Test} />
        <PublicRoute path='/register' component={Test} />
        <PrivateRoute path='/todos' component={Test} roles={['user', 'admin']} />
        <PrivateRoute path='/admin' component={Test} roles={['admin']} />
      </Switch>
    </Router>
  )
}

export default App;
