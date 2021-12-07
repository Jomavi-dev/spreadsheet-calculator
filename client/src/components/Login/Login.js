import { useState, useContext } from 'react'
import AuthService from '../../services/AuthService'
import { AuthContext } from '../../context/AuthContext'
import MessageBox from '../Message/Message'

function Login(props) {
  let initUser = { username: '', password: '' }
  const [user, setUser] = useState(initUser)
  const [message, setMessage] = useState(null)
  const authContext = useContext(AuthContext)

  const handleChange = e => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    AuthService.login(user).then(data => {
      const { isAuthenticated, user, message } = data
      if (isAuthenticated) {
        setUser(initUser)
        authContext.setUser(user)
        authContext.setIsAuth(isAuthenticated)
        props.history.push('/todos')
      }
      else
        setMessage(message)
    })
  }

  const { username, password } = user
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 mx-4">Login</h2>

      {message && <MessageBox {...message} />}

      <form onSubmit={handleSubmit} className="container-form">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            required
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            required
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary form-control">Login</button>
      </form>
    </div >
  )
}

export default Login