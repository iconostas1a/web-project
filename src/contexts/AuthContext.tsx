import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api, { setAuthToken } from '../api'

interface User {
  id: number
  email: string
  nickname: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const logout = () => {
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }

  const fetchUser = async () => {
    if (!token) return
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      logout()
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const newToken = response.data.token
    setToken(newToken)
    setAuthToken(newToken)
    await new Promise(resolve => setTimeout(resolve, 100))
    await fetchUser()
  }

  const register = async (email: string, password: string, nickname: string) => {
    await api.post('/auth/register', { email, password, nickname })
    await login(email, password)
  }

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      fetchUser()
    }
  }, [token])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    fetchUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

