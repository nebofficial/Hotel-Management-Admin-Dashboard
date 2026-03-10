'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { ReportsHeader } from './ReportsHeader'
import { ReportsSummaryCards } from './ReportsSummaryCards'
import { ReportsChartsPanel } from './ReportsChartsPanel'
import { QuickReportsNavigation } from './QuickReportsNavigation'
import { DashboardFilters } from './DashboardFilters'
import { DashboardExport } from './DashboardExport'
import { RecentReportsActivity } from './RecentReportsActivity'
import {
  fetchRevenueSummary,
  fetchOccupancyStats,
  fetchRestaurantSales,
  fetchExpenseSummary,
  fetchReportsCharts,
} from '@/services/api/reportsDashboardApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

function getDefaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 29)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export default function ReportsDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setRange] = useState(getDefaultRange)
  const [revenueSummary, setRevenueSummary] = useState(null)
  const [occupancyStats, setOccupancyStats] = useState(null)
  const [restaurantSales, setRestaurantSales] = useState(null)
  const [expenseSummary, setExpenseSummary] = useState(null)
  const [charts, setCharts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const filters = useMemo(
    () => ({ startDate, endDate }),
    [startDate, endDate],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [rev, occ, rest, exp, chartData] = await Promise.all([
        fetchRevenueSummary(apiBase, filters),
        fetchOccupancyStats(apiBase, filters),
        fetchRestaurantSales(apiBase, filters),
        fetchExpenseSummary(apiBase, filters),
        fetchReportsCharts(apiBase, filters),
      ])
      setRevenueSummary(rev)
      setOccupancyStats(occ)
      setRestaurantSales(rest)
      setExpenseSummary(exp)
      setCharts(chartData)
    } catch (err) {
      console.error('Reports dashboard load error', err)
      setError(err?.message || 'Failed to load reports dashboard')
      setRevenueSummary(null)
      setOccupancyStats(null)
      setRestaurantSales(null)
      setExpenseSummary(null)
      setCharts(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate])

  const handleResetRange = () => {
    setRange(getDefaultRange())
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view reports dashboard.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-900/5">
      <ReportsHeader onRefresh={load} loading={loading} />

      <DashboardFilters
        startDate={startDate}
        endDate={endDate}
        onChangeStart={(value) => setRange((prev) => ({ ...prev, startDate: value || getDefaultRange().startDate }))}
        onChangeEnd={(value) => setRange((prev) => ({ ...prev, endDate: value || getDefaultRange().endDate }))}
        onReset={handleResetRange}
      />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <ReportsSummaryCards
        revenueSummary={revenueSummary}
        occupancyStats={occupancyStats}
        restaurantSales={restaurantSales}
        expenseSummary={expenseSummary}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <ReportsChartsPanel charts={charts} />
        </div>
        <div className="space-y-4">
          <QuickReportsNavigation />
          <DashboardExport apiBase={apiBase} filters={filters} />
          <RecentReportsActivity items={charts?.recentReports || []} />
        </div>
      </div>
    </div>
  )
}

