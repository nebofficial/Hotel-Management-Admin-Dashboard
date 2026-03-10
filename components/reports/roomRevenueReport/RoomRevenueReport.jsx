'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoomRevenueHeader } from './RoomRevenueHeader'
import { RevenueStatsCards } from './RevenueStatsCards'
import { RoomRevenueFilters } from './RoomRevenueFilters'
import { ADRCard } from './ADRCard'
import { RevPARCard } from './RevPARCard'
import { RevenueByRoomType } from './RevenueByRoomType'
import { RevenueByDateRange } from './RevenueByDateRange'
import { RevenueTrendChart } from './RevenueTrendChart'
import { RoomRevenueTable } from './RoomRevenueTable'
import { RoomRevenueExport } from './RoomRevenueExport'
import {
  fetchRoomRevenueSummary,
  fetchRevenueByRoomType,
  fetchRevenueByDateRange,
  fetchRevenueTrend,
  fetchRoomRevenueDetails,
} from '@/services/api/roomRevenueApi'

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

export default function RoomRevenueReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate, roomType }, setFilters] = useState(() => ({ ...getDefaultRange(), roomType: '' }))
  const [summary, setSummary] = useState(null)
  const [revenueByRoomType, setRevenueByRoomType] = useState([])
  const [revenueByDate, setRevenueByDate] = useState([])
  const [trend, setTrend] = useState([])
  const [roomTypeRevenue, setRoomTypeRevenue] = useState([])
  const [details, setDetails] = useState([])
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
      const [summaryRes, byTypeRes, byDateRes, trendRes, detailsRes] = await Promise.all([
        fetchRoomRevenueSummary(apiBase, filters),
        fetchRevenueByRoomType(apiBase, filters),
        fetchRevenueByDateRange(apiBase, filters),
        fetchRevenueTrend(apiBase, filters),
        fetchRoomRevenueDetails(apiBase, filters),
      ])
      setSummary(summaryRes)
      setRevenueByRoomType(byTypeRes.revenueByRoomType ?? [])
      setRevenueByDate(byDateRes.revenueByDate ?? [])
      setTrend(trendRes.trend ?? [])
      setRoomTypeRevenue(trendRes.roomTypeRevenue ?? [])
      setDetails(detailsRes.details ?? [])
      const types = (byTypeRes.revenueByRoomType ?? []).map((r) => r.roomType).filter(Boolean)
      setRoomTypes([...new Set(types)])
    } catch (err) {
      console.error('Room revenue report load error', err)
      setError(err?.message || 'Failed to load room revenue report')
      setSummary(null)
      setRevenueByRoomType([])
      setRevenueByDate([])
      setTrend([])
      setRoomTypeRevenue([])
      setDetails([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate, roomType])

  const handleReset = () => setFilters({ ...getDefaultRange(), roomType: '' })
  const handleRoomTypeChange = (v) => setFilters((p) => ({ ...p, roomType: v || '' }))

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view room revenue report.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-900/5">
      <RoomRevenueHeader onRefresh={load} loading={loading} />
      <RoomRevenueFilters
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
      <RevenueStatsCards summary={summary} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ADRCard adr={summary?.adr} roomNightsSold={summary?.roomNightsSold} />
        <RevPARCard revpar={summary?.revpar} totalRooms={summary?.totalRooms} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="roomtype">
            <TabsList className="bg-white border rounded-xl p-1">
              <TabsTrigger value="roomtype" className="rounded-lg text-xs">By Room Type</TabsTrigger>
              <TabsTrigger value="date" className="rounded-lg text-xs">By Date</TabsTrigger>
              <TabsTrigger value="details" className="rounded-lg text-xs">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="roomtype">
              <RevenueByRoomType data={revenueByRoomType} loading={loading} />
            </TabsContent>
            <TabsContent value="date">
              <RevenueByDateRange data={revenueByDate} loading={loading} />
            </TabsContent>
            <TabsContent value="details">
              <RoomRevenueTable details={details} loading={loading} />
            </TabsContent>
          </Tabs>
          <RevenueTrendChart trend={trend} roomTypeRevenue={roomTypeRevenue} loading={loading} />
        </div>
        <div className="space-y-4">
          <RoomRevenueExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}
