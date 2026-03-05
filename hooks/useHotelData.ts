"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/auth-context"

/**
 * Custom hook to fetch hotel-specific data
 * Automatically includes hotelId in API calls
 */
export function useHotelData<T>(endpoint: string, options?: RequestInit) {
  const { user, hotel } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await fetch(`${API_BASE_URL}/api/hotel-data/${user.hotelId}${endpoint}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options?.headers,
          },
        })

        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else {
          setError("Failed to fetch data")
        }
      } catch (err) {
        console.error("Error fetching hotel data:", err)
        setError("An error occurred while fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.hotelId, endpoint])

  return { data, loading, error, refetch: () => {} }
}
