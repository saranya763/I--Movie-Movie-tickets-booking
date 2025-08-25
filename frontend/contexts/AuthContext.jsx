"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { users } from "@/lib/mockData"

const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  isLoading: false,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("imovies-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in mock data
      const foundUser = users.find((u) => u.email === email)

      if (!foundUser) {
        throw new Error("User not found")
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password

      setUser(userWithoutPassword)
      localStorage.setItem("imovies-user", JSON.stringify(userWithoutPassword))

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUser = users.find((u) => u.email === userData.email)
      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        isAdmin: false,
        bookings: [],
      }

      // Add to mock users array (in real app, this would be an API call)
      users.push(newUser)

      setUser(newUser)
      localStorage.setItem("imovies-user", JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("imovies-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
