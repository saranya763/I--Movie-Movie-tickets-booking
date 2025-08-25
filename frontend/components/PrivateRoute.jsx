"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (adminOnly && !user.isAdmin) {
        router.push("/")
        return
      }
    }
  }, [user, isLoading, router, adminOnly])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  if (!user || (adminOnly && !user.isAdmin)) {
    return null
  }

  return children
}
