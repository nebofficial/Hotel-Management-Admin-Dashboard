"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/app/auth-context"
import {
  fetchPropertyStats,
  fetchTotalRevenue,
  fetchTotalBookings,
  fetchOccupancyAcrossProperties,
  fetchPropertyComparison,
  fetchRevenueDistribution,
  fetchMonthlyTrends,
} from "@/services/api/multiPropertyApi"
import { CentralHeader } from "./CentralHeader"
import { CentralStatsCards } from "./CentralStatsCards"
import { TotalBookingsPanel } from "./TotalBookingsPanel"
import { RevenueOverviewPanel } from "./RevenueOverviewPanel"
import { OccupancyComparisonChart } from "./OccupancyComparisonChart"
import { PropertyRevenueChart } from "./PropertyRevenueChart"
import { PropertyPerformanceRanking } from "./PropertyPerformanceRanking"
import { MonthlyPerformanceTrend } from "./MonthlyPerformanceTrend"
import { RevenueDistributionAnalytics } from "./RevenueDistributionAnalytics"

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000"

function getDefaultDates() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export default function CentralDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [stats, setStats] = useState({ totalProperties: 0, totalActiveBookings: 0, overallOccupancyRate: 0 })
  const [revenue, setRevenue] = useState({ totalRevenue: 0, revenueToday: 0, averageRevenuePerProperty: 0, byProperty: [] })
  const [bookings, setBookings] = useState({ totalBookings: 0, byProperty: [] })
  const [occupancy, setOccupancy] = useState<{ hotelName: string; occupancyRate: number; totalRooms: number; occupied: number }[]>([])
  const [comparison, setComparison] = useState<{ hotelName: string; revenue: number; occupancyRate: number }[]>([])
  const [distribution, setDistribution] = useState({ byProperty: [] as { name: string; value: number }[] })
  const [trends, setTrends] = useState<{ month: string; totalRevenue: number; totalBookings: number; averageOccupancy: number }[]>([])

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const params = { startDate, endDate }
      const [statsRes, revRes, bookRes, occRes, compRes, distRes, trendRes] = await Promise.all([
        fetchPropertyStats(API_BASE),
        fetchTotalRevenue(API_BASE, params),
        fetchTotalBookings(API_BASE, params),
        fetchOccupancyAcrossProperties(API_BASE),
        fetchPropertyComparison(API_BASE, params),
        fetchRevenueDistribution(API_BASE, params),
        fetchMonthlyTrends(API_BASE, { months: "6" }),
      ])
      setStats(statsRes)
      setRevenue(revRes)
      setBookings(bookRes)
      setOccupancy(occRes.properties || [])
      setComparison(compRes.properties || [])
      setDistribution(distRes)
      setTrends(trendRes.trends || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [user, startDate, endDate])

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

  const revenueByProperty = (revenue.byProperty || []).map((p: { hotelName: string; revenue: number }) => ({ name: p.hotelName, value: p.revenue }))
  const distByProperty = (distribution.byProperty || []).map((p: { name: string; value: number }) => ({ name: p.name, value: p.value }))

  return (
    <main className="space-y-6 p-4 md:p-6">
      <CentralHeader startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} onApply={handleApply} onReset={handleReset} />
      <CentralStatsCards
        totalBookings={bookings.totalBookings}
        totalRevenue={revenue.totalRevenue}
        averageOccupancy={stats.overallOccupancyRate}
        activeProperties={stats.totalProperties}
        loading={loading}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <TotalBookingsPanel totalBookings={bookings.totalBookings} byProperty={bookings.byProperty || []} loading={loading} />
        <RevenueOverviewPanel totalRevenue={revenue.totalRevenue} revenueToday={revenue.revenueToday} averageRevenuePerProperty={revenue.averageRevenuePerProperty} loading={loading} />
      </div>
      <OccupancyComparisonChart properties={occupancy} loading={loading} />
      <PropertyRevenueChart byProperty={revenueByProperty.length ? revenueByProperty : distByProperty} loading={loading} />
      <div className="grid gap-4 lg:grid-cols-2">
        <PropertyPerformanceRanking properties={comparison} loading={loading} />
        <MonthlyPerformanceTrend trends={trends} loading={loading} />
      </div>
      <RevenueDistributionAnalytics byProperty={distByProperty.length ? distByProperty : revenueByProperty} loading={loading} />
    </main>
  )
}
