'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import {
  fetchAttendanceStats,
  fetchDutyStatus,
  fetchLeaveRequests,
  fetchStaffDistribution,
  fetchStaffSummary,
} from '@/services/api/hrDashboardApi'
import { HRStatsCards } from './HRStatsCards'
import { StaffCountOverview } from './StaffCountOverview'
import { DutyStatusToday } from './DutyStatusToday'
import { LeaveRequestAlerts } from './LeaveRequestAlerts'
import { AttendanceRatePanel } from './AttendanceRatePanel'
import { AttendanceAnalyticsChart } from './AttendanceAnalyticsChart'
import { StaffDistributionChart } from './StaffDistributionChart'
import { RecentHRActivities } from './RecentHRActivities'
import { HRDashboardFilters } from './HRDashboardFilters'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function HRDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [summary, setSummary] = useState(null)
  const [duty, setDuty] = useState([])
  const [pendingLeaves, setPendingLeaves] = useState([])
  const [attendanceToday, setAttendanceToday] = useState(null)
  const [attendanceTrend, setAttendanceTrend] = useState([])
  const [distribution, setDistribution] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(false)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  useEffect(() => {
    if (!apiBase) return
    const load = async () => {
      setLoading(true)
      try {
        const results = await Promise.allSettled([
          fetchStaffSummary(apiBase),
          fetchDutyStatus(apiBase),
          fetchLeaveRequests(apiBase),
          fetchAttendanceStats(apiBase),
          fetchStaffDistribution(apiBase),
        ])
        const [s, d, l, a, dist] = results.map((r) => (r.status === 'fulfilled' ? r.value : null))
        setSummary(s?.summary ?? null)
        setDuty(d?.list ?? [])
        setPendingLeaves(l?.pending ?? [])
        setAttendanceToday(a?.today ?? null)
        setAttendanceTrend(a?.trend ?? [])
        setDistribution(dist?.departments ?? [])
      } catch (err) {
        console.error('HR dashboard load error', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [apiBase])

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel to view the HR & Staff Dashboard.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">HR & Staff Dashboard</h2>
          <p className="text-xs text-slate-600 mt-1">
            Live snapshot of staff strength, duty status, attendance, and HR activities.
          </p>
        </div>
        <div className="text-[11px] text-slate-500">
          {loading ? 'Refreshing metrics…' : 'Updated with latest staff schedules'}
        </div>
      </div>

      <HRStatsCards summary={summary} />

      <HRDashboardFilters filters={filters} onChange={setFilters} />

      <div className="grid gap-4 lg:grid-cols-[2fr,1.5fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <StaffCountOverview summary={summary} />
            <AttendanceRatePanel today={attendanceToday} />
          </div>
          <AttendanceAnalyticsChart trend={attendanceTrend} />
          <StaffDistributionChart departments={distribution} />
        </div>
        <div className="space-y-4">
          <DutyStatusToday list={duty} />
          <LeaveRequestAlerts pending={pendingLeaves} />
          <RecentHRActivities pendingLeaves={pendingLeaves} dutyList={duty} />
        </div>
      </div>
    </div>
  )
}

