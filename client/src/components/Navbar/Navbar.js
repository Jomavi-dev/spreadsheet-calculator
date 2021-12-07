import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/AuthService'
import { AuthContext } from '../../context/AuthContext'

const Navbar = () => {
  const { user, setUser, isAuth, setIsAuth } = useContext(AuthContext)

  const handleLogout = () => {
    AuthService.logout().then(data => {
      if (data.success) {
        setUser(data.user)
        setIsAuth(false)
      }
    })
  }

  const unAuthNavBarItems = [
    <li key='1' className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>,
    <li key='2' className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
  ]

  const authNavBarItems = [
    <li key='1' className="nav-item"><NavLink className="nav-link" to="/todos">Todos</NavLink></li>,
    user.role === 'admin' && <li key='3' className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>,
    <li key='2' className="nav-item"><button className="nav-link btn" style={{ fontWeight: '500' }} href="/" onClick={handleLogout}>Logout</button></li>
  ]

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div className="container">
        <NavLink className="navbar-brand mb-0 h1" to="/">Dathou</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-sm-3 mb-lg-0" style={{ fontWeight: 500 }}>
            {isAuth ? authNavBarItems : unAuthNavBarItems}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar