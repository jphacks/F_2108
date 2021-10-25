import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/auth';
import { auth } from '@lib/auth';

export const AuthContext = createContext<firebase.User | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setUser(null);
      } else {
        setUser(user);
      }
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}