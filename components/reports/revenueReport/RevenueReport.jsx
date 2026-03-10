'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { RevenueReportHeader } from './RevenueReportHeader'
import { RevenueSummaryCards } from './RevenueSummaryCards'
import { RevenueFilters } from './RevenueFilters'
import { RevenueByRooms } from './RevenueByRooms'
import { RevenueByRestaurant } from './RevenueByRestaurant'
import { RevenueByServices } from './RevenueByServices'
import { DailyRevenueReport } from './DailyRevenueReport'
import { MonthlyRevenueReport } from './MonthlyRevenueReport'
import { RevenueTrendChart } from './RevenueTrendChart'
import { RevenueExport } from './RevenueExport'
import { RevenueTable } from './RevenueTable'
import {
  fetchTotalRevenue,
  fetchRevenueByRooms,
  fetchRevenueByRestaurant,
  fetchRevenueByServices,
  fetchDailyRevenue,
  fetchMonthlyRevenue,
  fetchRevenueTrend,
} from '@/services/api/revenueReportApi'

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
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) }
}

export default function RevenueReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setFilters] = useState(getDefaultRange)
  const [summary, setSummary] = useState(null)
  const [revenueByRooms, setRevenueByRooms] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [services, setServices] = useState({ services: [], totalServiceRevenue: 0 })
  const [daily, setDaily] = useState([])
  const [monthly, setMonthly] = useState([])
  const [trend, setTrend] = useState([])
  const [departmentRevenue, setDepartmentRevenue] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId]
  )

  const filters = useMemo(() => ({ startDate, endDate }), [startDate, endDate])

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [tot, rooms, rest, svc, d, m, tr] = await Promise.all([
        fetchTotalRevenue(apiBase),
        fetchRevenueByRooms(apiBase, filters),
        fetchRevenueByRestaurant(apiBase, filters),
        fetchRevenueByServices(apiBase, filters),
        fetchDailyRevenue(apiBase, filters),
        fetchMonthlyRevenue(apiBase, filters),
        fetchRevenueTrend(apiBase, filters),
      ])
      setSummary(tot)
      setRevenueByRooms(rooms?.revenueByRooms ?? [])
      setRestaurant(rest)
      setServices({ services: svc?.services ?? [], totalServiceRevenue: svc?.totalServiceRevenue ?? 0 })
      setDaily(d?.daily ?? [])
      setMonthly(m?.monthly ?? [])
      setTrend(tr?.trend ?? [])
      setDepartmentRevenue(tr?.departmentRevenue ?? [])
    } catch (err) {
      console.error('Revenue report load error', err)
      setError(err?.message || 'Failed to load revenue report')
      setSummary(null)
      setRevenueByRooms([])
      setRestaurant(null)
      setServices({ services: [], totalServiceRevenue: 0 })
      setDaily([])
      setMonthly([])
      setTrend([])
      setDepartmentRevenue([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate])

  const handleReset = () => setFilters(getDefaultRange())

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view revenue report.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-900/5">
      <RevenueReportHeader onRefresh={load} loading={loading} />
      <RevenueFilters
        startDate={startDate}
        endDate={endDate}
        onChangeStart={(v) => setFilters((p) => ({ ...p, startDate: v || getDefaultRange().startDate }))}
        onChangeEnd={(v) => setFilters((p) => ({ ...p, endDate: v || getDefaultRange().endDate }))}
        onReset={handleReset}
      />
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      <RevenueSummaryCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <RevenueByRooms revenueByRooms={revenueByRooms} loading={loading} />
          <RevenueByRestaurant data={restaurant} loading={loading} />
          <RevenueByServices services={services.services} totalServiceRevenue={services.totalServiceRevenue} loading={loading} />
          <DailyRevenueReport daily={daily} loading={loading} />
          <MonthlyRevenueReport monthly={monthly} loading={loading} />
          <RevenueTrendChart trend={trend} departmentRevenue={departmentRevenue} loading={loading} />
          <RevenueTable daily={daily} loading={loading} />
        </div>
        <div className="space-y-4">
          <RevenueExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}
