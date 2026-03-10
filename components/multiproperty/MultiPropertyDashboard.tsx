"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/app/auth-context"
import {
  fetchPropertyStats,
  fetchOccupancyAcrossProperties,
  fetchTotalRevenue,
  fetchPropertyComparison,
  fetchRevenueDistribution,
  fetchRecentPropertyActivity,
} from "@/services/api/multiPropertyApi"
import { MultiPropertyHeader } from "./MultiPropertyHeader"
import { PropertyStatsCards } from "./PropertyStatsCards"
import { TotalRevenuePanel } from "./TotalRevenuePanel"
import { OccupancyOverview } from "./OccupancyOverview"
import { PropertyPerformanceComparison } from "./PropertyPerformanceComparison"
import { RevenueDistributionChart } from "./RevenueDistributionChart"
import { PropertyReportsQuickAccess } from "./PropertyReportsQuickAccess"
import { RecentPropertyActivity } from "./RecentPropertyActivity"
import { MultiPropertyAnalyticsCharts } from "./MultiPropertyAnalyticsCharts"

function getDefaultDates() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export default function MultiPropertyDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalRooms: 0,
    totalActiveBookings: 0,
    overallOccupancyRate: 0,
    totalRevenueToday: 0,
  })
  const [occupancy, setOccupancy] = useState<{ hotelName: string; occupancyRate: number; totalRooms: number; occupied: number }[]>([])
  const [revenue, setRevenue] = useState({
    totalRevenue: 0,
    revenueToday: 0,
    averageRevenuePerProperty: 0,
    byProperty: [] as { hotelName: string; revenue: number }[],
  })
  const [comparison, setComparison] = useState<{ hotelName: string; occupancyRate: number; revenue: number; averageDailyRate: number; revPAR: number }[]>([])
  const [distribution, setDistribution] = useState({ byProperty: [] as { name: string; value: number }[], totalRevenue: 0 })
  const [activities, setActivities] = useState<{ type: string; propertyName: string; message: string; createdAt: string }[]>([])

  const apiBase =
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:5000"

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const params = { startDate, endDate }
      const [statsRes, occRes, revRes, compRes, distRes, actRes] = await Promise.all([
        fetchPropertyStats(apiBase),
        fetchOccupancyAcrossProperties(apiBase),
        fetchTotalRevenue(apiBase, params),
        fetchPropertyComparison(apiBase, params),
        fetchRevenueDistribution(apiBase, params),
        fetchRecentPropertyActivity(apiBase, { limit: "10" }),
      ])
      setStats(statsRes)
      setOccupancy(occRes.properties || [])
      setRevenue(revRes)
      setComparison(compRes.properties || [])
      setDistribution(distRes)
      setActivities(actRes.activities || [])
    } catch (e) {
      console.error("Multi-property load error:", e)
    } finally {
      setLoading(false)
    }
  }, [apiBase, user, startDate, endDate])

  useEffect(() => {
    const { startDate: s, endDate: e } = getDefaultDates()
    setStartDate(s)
    setEndDate(e)
  }, [])

  useEffect(() => {
    if (startDate && endDate) load()
  }, [load, startDate, endDate])

  const handleApply = () => load()
  const handleReset = () => {
    const { startDate: s, endDate: e } = getDefaultDates()
    setStartDate(s)
    setEndDate(e)
  }

  const revenueByProperty = revenue.byProperty?.map((p) => ({ name: p.hotelName, value: p.revenue })) ?? []
  const occupancyByProperty = occupancy.map((p) => ({ name: p.hotelName, rate: p.occupancyRate }))

  return (
    <main className="space-y-6 p-4 md:p-6">
      <MultiPropertyHeader
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        onApply={handleApply}
        onReset={handleReset}
      />

      <PropertyStatsCards
        totalProperties={stats.totalProperties}
        totalRooms={stats.totalRooms}
        totalActiveBookings={stats.totalActiveBookings}
        overallOccupancyRate={stats.overallOccupancyRate}
        loading={loading}
      />

      <TotalRevenuePanel
        totalRevenue={revenue.totalRevenue}
        revenueToday={revenue.revenueToday}
        averageRevenuePerProperty={revenue.averageRevenuePerProperty}
        loading={loading}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <OccupancyOverview properties={occupancy} loading={loading} />
        <PropertyPerformanceComparison properties={comparison} loading={loading} />
      </div>

      <RevenueDistributionChart
        byProperty={distribution.byProperty}
        totalRevenue={distribution.totalRevenue}
        loading={loading}
      />

      <MultiPropertyAnalyticsCharts
        revenueByProperty={revenueByProperty}
        occupancyByProperty={occupancyByProperty}
        loading={loading}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentPropertyActivity activities={activities} loading={loading} />
        <PropertyReportsQuickAccess />
      </div>
    </main>
  )
}
