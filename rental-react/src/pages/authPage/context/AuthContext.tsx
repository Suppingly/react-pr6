import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

// Тип для контекста аутентификации
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User | void>
  register: (name: string, email: string, password: string) => Promise<User | void>
  logout: () => Promise<void>
}

// Создаём контекст для аутентификации с типом AuthContextType
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = 'http://localhost:4200/api/auth'

// Компонент-обертка, который предоставляет данные и методы аутентификации
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUserData = async () => {
      const res = await fetch(`${API_URL}/profile/token`, {
        method: 'GET',
        credentials: 'include',
      })
      if (res.ok) {
        try {
          const res = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            credentials: 'include',
          })

          if (res.ok) {
            const body = await res.json()
            const data: User = body.data
            setUser(data)
            navigate('/library')
          } else {
            setUser(null)
          }
        } catch (err) {
          setError('Ошибка при получении данных пользователя')
          console.log(err)
        } finally {
          setLoading(false)
        }
      } else {
        setUser(null)
        setLoading(false)
      }
    }
    getUserData()
  }, [])

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null)

      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) throw new Error('Ошибка регистрации')

      const profileRes = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        credentials: 'include',
      })

      if (profileRes.ok) {
        const body = await profileRes.json()
        const userData: User = body.data
        setUser(userData)
        return userData
      } else {
        const body = await res.json()
        const data: User = body.data
        setUser(data)
        return data
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Вход пользователя
  const login = async (email: string, password: string) => {
    try {
      setError(null)

      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error('Неверный email или пароль')

      const profileRes = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      })

      if (profileRes.ok) {
        const body = await profileRes.json()
        const userData: User = body.data
        setUser(userData)
        return userData
      } else {
        throw new Error('Не удалось получить данные пользователя')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Выход пользователя
  const logout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Хук для получения контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
