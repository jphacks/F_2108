import React, { createContext, useState, useEffect } from "react"
import { auth } from "@lib/firebase"

type Auth =
  | {
      user: {
        uid: string
        displayName: string
        photoURL: string
        isAnonymous: boolean
        getIdToken: () => Promise<string>
      } | null
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
    auth.onIdTokenChanged((user) => {
      if (!user) {
        setUser({ user: null, initialized: true })
      } else {
        setUser({
          user: {
            uid: user.uid,
            // NOTE: 匿名ログインからの昇格時にdisplayNameやphotoURLが反映されないことがあるため
            displayName:
              user.displayName ??
              user.providerData?.[0]?.displayName ??
              "no name",
            photoURL: user.photoURL ?? user.providerData?.[0]?.photoURL ?? "",
            isAnonymous: user.isAnonymous,
            getIdToken: () => user.getIdToken(),
          },
          initialized: true,
        })
      }
    })
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
