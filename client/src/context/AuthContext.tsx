import { createContext } from 'react'

export const AuthContext = createContext({
  token: null as string | null,
  setToken: (token: string | null) => {},
  user: null
})import { createContext } from 'react'  export const AuthContext = createContext({   token: null as string | null,   setToken: (token: string | null) => {},   user: null })
