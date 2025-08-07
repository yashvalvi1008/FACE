"use client"

import { useState, useEffect, createContext, useContext } from "react"

interface User {
  id: string
  name: string
  email: string
  type: 'student' | 'admin' | 'teacher'
  studentId?: string
  department?: string
  accessLevel?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: any, userType: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    // Return a mock implementation for demo purposes
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      }
    }, [])

    const login = async (credentials: any, userType: string) => {
      // Demo authentication logic
      let demoUser: User | null = null

      if (userType === 'student' && credentials.studentId === 'student123' && credentials.password === 'password') {
        demoUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@student.edu',
          type: 'student',
          studentId: 'student123',
          department: 'Computer Science'
        }
      } else if (userType === 'admin' && credentials.email === 'admin@school.edu' && credentials.password === 'admin123') {
        demoUser = {
          id: '2',
          name: 'Dr. Jane Smith',
          email: 'admin@school.edu',
          type: 'admin',
          accessLevel: 'super'
        }
      }

      if (demoUser) {
        setUser(demoUser)
        setIsAuthenticated(true)
        localStorage.setItem('currentUser', JSON.stringify(demoUser))
      } else {
        throw new Error('Invalid credentials')
      }
    }

    const register = async (userData: any) => {
      // Demo registration logic
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.fullName,
        email: userData.email,
        type: userData.accountType
      }

      // Store in localStorage for demo
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
    }

    const logout = () => {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('currentUser')
    }

    return { user, isAuthenticated, login, register, logout }
  }
  return context
}
