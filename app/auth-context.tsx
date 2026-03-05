"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
  hotelId: string | null
  roleId: string | null
  permissions: string[]
}

interface Hotel {
  id: string
  name: string
  planId: string | null
}

interface Plan {
  id: string
  name: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  hotel: Hotel | null
  plan: Plan | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const getApiBaseUrl = () => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    }
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return `http://${window.location.hostname}:5000`
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  }

  // Check if user is authenticated on mount and route changes
  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setUser(null)
        setHotel(null)
        setPlan(null)
        setLoading(false)
        // Only redirect if not on public pages
        const publicPages = ["/login", "/signup", "/about", "/contact"]
        const isPublicPage =
          publicPages.includes(pathname) ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/about") ||
          pathname.startsWith("/contact")
        if (!isPublicPage) {
          router.push("/login")
        }
        return
      }

      // Fetch current user
      const API_BASE_URL = getApiBaseUrl()
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)

        // Fetch hotel if user has hotelId
        if (data.user.hotelId) {
          await fetchHotel(data.user.hotelId)
        } else {
          setHotel(null)
          setPlan(null)
        }
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setHotel(null)
        setPlan(null)
        if (pathname !== "/login") {
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      setHotel(null)
      setPlan(null)
      if (pathname !== "/login") {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchHotel = async (hotelId: string) => {
    try {
      const token = localStorage.getItem("token")
      const API_BASE_URL = getApiBaseUrl()
      const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHotel(data.hotel)

        // Fetch plan if hotel has planId
        if (data.hotel.planId) {
          await fetchPlan(data.hotel.planId)
        } else {
          setPlan(null)
        }
      }
    } catch (error) {
      console.error("Error fetching hotel:", error)
    }
  }

  const fetchPlan = async (planId: string) => {
    try {
      const token = localStorage.getItem("token")
      const API_BASE_URL = getApiBaseUrl()
      const response = await fetch(`${API_BASE_URL}/api/plans/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPlan(data.plan)
      }
    } catch (error) {
      console.error("Error fetching plan:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const API_BASE_URL = getApiBaseUrl()
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network error" }))
        console.error("Login failed:", errorData)
        return false
      }

      const data = await response.json()

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)

        // Fetch hotel and plan if user has hotelId
        if (data.user.hotelId) {
          await fetchHotel(data.user.hotelId)
        }

        return true
      } else {
        console.error("No token in response:", data)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("Backend server might not be running. Please check:")
        console.error("1. Backend server is running on port 5000")
        console.error("2. CORS is properly configured")
        console.error("3. Network connectivity is available")
      }
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setHotel(null)
    setPlan(null)
    router.push("/login")
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        hotel,
        plan,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
