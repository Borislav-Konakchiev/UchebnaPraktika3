import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from 'react'
import { clearAuthFromSession } from '~/lib/utils'
import {
  authTokenSessionKey,
  authUserSessionKey,
} from '~/models/auth/auth.constants'
import { type LoginResponse } from '~/models/auth/auth.models'
import type { User } from '~/models/user.models'

type AuthContext = {
  user: User | null
  token: string | null
  login: (loginResponse: LoginResponse) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContext | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isAuthenticated = token !== null

  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem(authTokenSessionKey)
      const storedUser = sessionStorage.getItem(authUserSessionKey)

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error loading auth from session:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = ({ user: newUser, token: newToken }: LoginResponse) => {
    setUser(newUser)
    setToken(newToken)
    sessionStorage.setItem(authUserSessionKey, JSON.stringify(newUser))
    sessionStorage.setItem(authTokenSessionKey, newToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    clearAuthFromSession()
  }

  const value = { user, token, login, logout, isAuthenticated, isLoading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
