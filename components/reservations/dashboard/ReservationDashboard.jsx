'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import KPISection from './KPISection'
import ReservationOverviewChart from './ReservationOverviewChart'
import PendingConfirmations from './PendingConfirmations'
import GroupBookingsCard from './GroupBookingsCard'
import CancellationToday from './CancellationToday'
import RecentBookingActivity from './RecentBookingActivity'
import DateFilter from './DateFilter'
import PropertyFilter from './PropertyFilter'
import { fetchReservationDashboard } from '@/services/api/reservationDashboardApi'

const REFRESH_INTERVAL_MS = 45000

export default function ReservationDashboard() {
  const { user, hotel } = useAuth()
  const router = useRouter()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [period, setPeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [propertyId, setPropertyId] = useState('all')

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const load = useCallback(async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const params =
        period === 'custom' && startDate && endDate
          ? { period, startDate, endDate }
          : { period }
      const json = await fetchReservationDashboard(apiBase, params)
      setData(json)
    } catch (e) {
      alert(e.message || 'Failed to load reservation dashboard')
    } finally {
      setLoading(false)
    }
  }, [apiBase, period, startDate, endDate])

  useEffect(() => {
    if (apiBase) load()
  }, [apiBase, load])

  useEffect(() => {
    if (!apiBase || !data) return
    const t = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(t)
  }, [apiBase, data, load])

  const handlePeriodChange = (p) => {
    setPeriod(p)
    if (p === 'custom') {
      const today = new Date().toISOString().slice(0, 10)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      setStartDate(weekAgo.toISOString().slice(0, 10))
      setEndDate(today)
    }
  }

  const handleCustomRange = ({ startDate: s, endDate: e }) => {
    setStartDate(s || '')
    setEndDate(e || '')
  }

  const handleKPIClick = (href) => router.push(href)

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to view Reservations Dashboard.</p>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading Reservations Dashboard…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations Dashboard</h1>
          <p className="text-gray-600 mt-1">Bookings KPIs, pending confirmations, and recent activity</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <DateFilter
            value={period}
            onChange={handlePeriodChange}
            startDate={startDate}
            endDate={endDate}
            onCustomChange={handleCustomRange}
            onApply={load}
          />
          <PropertyFilter value={propertyId} onChange={setPropertyId} properties={[]} />
        </div>
      </div>

      {data && (
        <>
          <KPISection kpis={data.kpis} onClick={handleKPIClick} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PendingConfirmations rows={data.pendingConfirmationsList || []} />
            <ReservationOverviewChart chartData={data.chartData || []} />
            <div className="space-y-6">
              <GroupBookingsCard count={data.kpis?.groupBookings || 0} />
              <CancellationToday count={data.kpis?.cancellationsToday || 0} />
            </div>
          </div>

          <RecentBookingActivity rows={data.recentBookingActivity || []} />
        </>
      )}
    </div>
  )
}

