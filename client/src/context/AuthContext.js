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
    <>
      {
        !isLoaded
          ? (
            <h2 className="text-center mt-32 text-3xl font-semi-bold leading-loose text-gray-600 sm:text-4xl">Loading...</h2>
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
    </>
  )
}

export default AuthProvider



// 09061449117