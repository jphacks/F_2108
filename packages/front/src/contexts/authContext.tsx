import React, { createContext, useState, useEffect } from "react"
import firebase from "firebase/auth"
import { auth } from "@lib/firebase"

type Auth =
  | {
      user: firebase.User | null
      initialized: true
    }
  | {
      user: null
      initialized: false
    }

export const AuthContext = createContext<Auth>({
  user: null,
  initialized: false,
})

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider: React.VFC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Auth>({ user: null, initialized: false })

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setUser({ user: null, initialized: true })
      } else {
        setUser({ user, initialized: true })
      }
    })
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
