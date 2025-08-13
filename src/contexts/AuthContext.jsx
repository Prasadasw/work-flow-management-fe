import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await api.get('/auth/me')
        setEmployee(response.data.data.employee)
      } catch (error) {
        localStorage.removeItem('token')
        setEmployee(null)
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, employee } = response.data.data
      
      localStorage.setItem('token', token)
      setEmployee(employee)
      toast.success('Login successful!')
      navigate('/')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (employeeData) => {
    try {
      const response = await api.post('/auth/register', employeeData)
      const { token, employee } = response.data.data
      
      localStorage.setItem('token', token)
      setEmployee(employee)
      toast.success('Registration successful!')
      navigate('/')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setEmployee(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const value = {
    employee,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!employee,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
