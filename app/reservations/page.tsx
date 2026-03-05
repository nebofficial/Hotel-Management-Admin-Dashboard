"use client"

import { DashboardOverview } from "@/components/dashboard-overview"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/app/auth-context"
import { useState, useEffect } from "react"

export default function ReservationsPage() {
  const { user, hotel } = useAuth()
  const [metrics, setMetrics] = useState([
    { label: "Total Reservations", value: "0", change: "0", trend: "up" as const },
    { label: "Pending Confirmations", value: "0", change: "0", trend: "down" as const },
    { label: "Group Bookings", value: "0", change: "0", trend: "up" as const },
    { label: "Cancellations Today", value: "0", change: "0", trend: "down" as const },
  ])

  const [chartData, setChartData] = useState([
    { name: "Week 1", value: 0 },
    { name: "Week 2", value: 0 },
    { name: "Week 3", value: 0 },
    { name: "Week 4", value: 0 },
  ])

  useEffect(() => {
    if (user?.hotelId) {
      fetchReservationsData()
    }
  }, [user?.hotelId])

  const fetchReservationsData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token || !user?.hotelId) return

      // Fetch hotel-specific reservations data
      // The backend should filter by hotelId automatically
      const response = await fetch(`http://localhost:5000/api/hotel-data/${user.hotelId}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Update metrics based on actual data
        // This is a placeholder - update with real data structure
        // setMetrics(calculateMetrics(data.bookings))
        // setChartData(calculateChartData(data.bookings))
      }
    } catch (error) {
      console.error("Error fetching reservations data:", error)
    }
  }

  return (
    <ProtectedRoute>
      <main className="p-4">
        <DashboardOverview
          title={`Reservations${hotel ? ` - ${hotel.name}` : ""}`}
          description="Manage all reservations, check-ins, check-outs, and guest requests"
          metrics={metrics}
          chartData={chartData}
          chartType="line"
        />
      </main>
    </ProtectedRoute>
  )
}
