'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OccupancyHeader } from './OccupancyHeader'
import { OccupancyStatsCards } from './OccupancyStatsCards'
import { OccupancyFilters } from './OccupancyFilters'
import { OccupancyPercentageCard } from './OccupancyPercentageCard'
import { DailyOccupancyReport } from './DailyOccupancyReport'
import { WeeklyOccupancyReport } from './WeeklyOccupancyReport'
import { MonthlyOccupancyReport } from './MonthlyOccupancyReport'
import { RoomTypeOccupancy } from './RoomTypeOccupancy'
import { OccupancyChartPanel } from './OccupancyChartPanel'
import { OccupancyExport } from './OccupancyExport'
import {
  fetchOccupancySummary,
  fetchDailyOccupancy,
  fetchWeeklyOccupancy,
  fetchMonthlyOccupancy,
  fetchRoomTypeOccupancy,
} from '@/services/api/occupancyReportApi'

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

export default function OccupancyReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate, roomType }, setFilters] = useState(() => ({ ...getDefaultRange(), roomType: '' }))
  const [summary, setSummary] = useState(null)
  const [daily, setDaily] = useState([])
  const [weekly, setWeekly] = useState([])
  const [monthly, setMonthly] = useState([])
  const [roomTypeOccupancy, setRoomTypeOccupancy] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const filters = useMemo(
    () => ({ startDate, endDate, roomType: roomType || undefined }),
    [startDate, endDate, roomType],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [summaryRes, dailyRes, weeklyRes, monthlyRes, roomTypeRes] = await Promise.all([
        fetchOccupancySummary(apiBase),
        fetchDailyOccupancy(apiBase, filters),
        fetchWeeklyOccupancy(apiBase, filters),
        fetchMonthlyOccupancy(apiBase, filters),
        fetchRoomTypeOccupancy(apiBase, filters),
      ])
      setSummary(summaryRes)
      setDaily(dailyRes.daily || [])
      setWeekly(weeklyRes.weekly || [])
      setMonthly(monthlyRes.monthly || [])
      setRoomTypeOccupancy(roomTypeRes.roomTypeOccupancy || [])
      const types = (roomTypeRes.roomTypeOccupancy || []).map((r) => r.roomType).filter(Boolean)
      setRoomTypes([...new Set(types)])
    } catch (err) {
      console.error('Occupancy report load error', err)
      setError(err?.message || 'Failed to load occupancy report')
      setSummary(null)
      setDaily([])
      setWeekly([])
      setMonthly([])
      setRoomTypeOccupancy([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate, roomType])

  const handleReset = () => {
    setFilters({ ...getDefaultRange(), roomType: '' })
  }

  const handleRoomTypeChange = (value) => {
    setFilters((prev) => ({ ...prev, roomType: value || '' }))
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view occupancy report.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-900/5">
      <OccupancyHeader onRefresh={load} loading={loading} />
      <OccupancyFilters
        startDate={startDate}
        endDate={endDate}
        roomType={roomType}
        roomTypes={roomTypes}
        onChangeStart={(v) => setFilters((p) => ({ ...p, startDate: v || getDefaultRange().startDate }))}
        onChangeEnd={(v) => setFilters((p) => ({ ...p, endDate: v || getDefaultRange().endDate }))}
        onChangeRoomType={handleRoomTypeChange}
        onReset={handleReset}
      />
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      <OccupancyStatsCards summary={summary} />
      <OccupancyPercentageCard rate={summary?.occupancyRateToday} label="Overall Occupancy Rate" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="daily">
            <TabsList className="bg-white border rounded-xl p-1">
              <TabsTrigger value="daily" className="rounded-lg text-xs">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-lg text-xs">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-lg text-xs">Monthly</TabsTrigger>
              <TabsTrigger value="roomtype" className="rounded-lg text-xs">Room Type</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <DailyOccupancyReport daily={daily} loading={loading} />
            </TabsContent>
            <TabsContent value="weekly">
              <WeeklyOccupancyReport weekly={weekly} loading={loading} />
            </TabsContent>
            <TabsContent value="monthly">
              <MonthlyOccupancyReport monthly={monthly} loading={loading} />
            </TabsContent>
            <TabsContent value="roomtype">
              <RoomTypeOccupancy roomTypeOccupancy={roomTypeOccupancy} loading={loading} />
            </TabsContent>
          </Tabs>
          <OccupancyChartPanel daily={daily} roomTypeOccupancy={roomTypeOccupancy} loading={loading} />
        </div>
        <div className="space-y-4">
          <OccupancyExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}
