import React, { createContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'


export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    AuthService.isAuth().then(data => {
      setUser(data.user)
      setIsAuth(data.isAuthenticated)
      setIsLoaded(true)
    })
  }, [])

  return (
    <div>
      {
        !isLoaded
          ? (
            <h2 style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>Loading</h2>
          ) : (
            <AuthContext.Provider value={{
              user,
              setUser,
              isAuth,
              setIsAuth
            }}>
              {children}
            </AuthContext.Provider>
          )
      }
    </div >
  )
}

export default AuthProvider



// 09061449117