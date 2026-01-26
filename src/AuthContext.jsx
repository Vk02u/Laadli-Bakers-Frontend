import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
const API_BASE_URL = 'http://localhost:4000'

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      // Verify token with backend
      verifyToken()
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUser({ username: data.username })
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('adminToken')
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
      setUser(null)
    }
    setIsLoading(false)
  }

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('adminToken', data.access_token)
        setIsAuthenticated(true)
        setUser({ username })
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, message: errorData.detail || 'Login failed' }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, message: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    }

    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setUser(null)
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getAuthHeaders,
    verifyToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
