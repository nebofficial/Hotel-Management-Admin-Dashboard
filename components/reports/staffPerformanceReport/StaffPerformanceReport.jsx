'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { StaffPerformanceHeader } from './StaffPerformanceHeader'
import { StaffPerformanceSummaryCards } from './StaffPerformanceSummaryCards'
import { StaffPerformanceFilters } from './StaffPerformanceFilters'
import { AttendancePerformanceReport } from './AttendancePerformanceReport'
import { TaskCompletionReport } from './TaskCompletionReport'
import { SalesPerformanceReport } from './SalesPerformanceReport'
import { CommissionPerformanceReport } from './CommissionPerformanceReport'
import { DepartmentPerformanceAnalysis } from './DepartmentPerformanceAnalysis'
import { StaffPerformanceTrendChart } from './StaffPerformanceTrendChart'
import { StaffPerformanceExport } from './StaffPerformanceExport'
import { StaffPerformanceTable } from './StaffPerformanceTable'
import {
  fetchAttendancePerformance,
  fetchTaskCompletion,
  fetchSalesPerformance,
  fetchCommissionPerformance,
  fetchDepartmentPerformance,
} from '@/services/api/staffPerformanceApi'

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

export default function StaffPerformanceReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setFilters] = useState(getDefaultRange)
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [attendance, setAttendance] = useState([])
  const [tasks, setTasks] = useState([])
  const [sales, setSales] = useState([])
  const [commissions, setCommissions] = useState([])
  const [departments, setDepartments] = useState([])
  const [attendanceTrend, setAttendanceTrend] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const filters = useMemo(() => {
    const f = { startDate, endDate }
    if (departmentFilter && departmentFilter !== 'all') f.department = departmentFilter
    return f
  }, [startDate, endDate, departmentFilter])

  const summary = useMemo(() => {
    const totalStaffEvaluated = attendance.length || sales.length || commissions.length
    const averageAttendanceRate =
      attendance.length > 0
        ? attendance.reduce((s, a) => s + (a.attendancePercentage || 0), 0) / attendance.length
        : 0
    const topSales = [...sales].sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))[0]
    const topPerformerName = topSales?.staffName || (attendance[0]?.staffName ?? '-')
    const totalStaffSales = sales.reduce((s, a) => s + (a.totalSales || 0), 0)
    return { totalStaffEvaluated, topPerformerName, averageAttendanceRate, totalStaffSales }
  }, [attendance, sales, commissions])

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [att, t, s, c, d] = await Promise.all([
        fetchAttendancePerformance(apiBase, filters),
        fetchTaskCompletion(apiBase, filters),
        fetchSalesPerformance(apiBase, filters),
        fetchCommissionPerformance(apiBase, filters),
        fetchDepartmentPerformance(apiBase, filters),
      ])
      setAttendance(att?.attendance ?? [])
      setTasks(t?.tasks ?? [])
      setSales(s?.sales ?? [])
      setCommissions(c?.commissions ?? [])
      setDepartments(d?.departments ?? [])

      // Build simple attendance trend from attendance data
      const byDate = {}
      ;(att?.attendance ?? []).forEach((r) => {
        const key = r.date || startDate
        if (!byDate[key]) byDate[key] = { date: key, present: 0, total: 0 }
        byDate[key].total += 1
        if (r.status !== 'Absent') byDate[key].present += 1
      })
      const trend = Object.values(byDate)
        .map((v) => ({
          date: v.date,
          attendanceRate: v.total > 0 ? (v.present / v.total) * 100 : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
      setAttendanceTrend(trend)
    } catch (err) {
      console.error('Staff performance report load error', err)
      setError(err?.message || 'Failed to load staff performance report')
      setAttendance([])
      setTasks([])
      setSales([])
      setCommissions([])
      setDepartments([])
      setAttendanceTrend([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate, departmentFilter])

  const handleReset = () => {
    setFilters(getDefaultRange())
    setDepartmentFilter('all')
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view staff performance report.</p>
      </div>
    )
  }

  const departmentNames = Array.from(new Set((departments || []).map((d) => d.department).filter(Boolean)))

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-900/5">
      <StaffPerformanceHeader onRefresh={load} loading={loading} />
      <StaffPerformanceFilters
        startDate={startDate}
        endDate={endDate}
        department={departmentFilter}
        departments={departmentNames}
        onChangeStart={(v) => setFilters((p) => ({ ...p, startDate: v || getDefaultRange().startDate }))}
        onChangeEnd={(v) => setFilters((p) => ({ ...p, endDate: v || getDefaultRange().endDate }))}
        onChangeDepartment={setDepartmentFilter}
        onReset={handleReset}
      />
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      <StaffPerformanceSummaryCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <AttendancePerformanceReport data={attendance} loading={loading} />
          <TaskCompletionReport data={tasks} loading={loading} />
          <SalesPerformanceReport data={sales} loading={loading} />
          <CommissionPerformanceReport data={commissions} loading={loading} />
          <DepartmentPerformanceAnalysis data={departments} loading={loading} />
          <StaffPerformanceTrendChart
            attendanceTrend={attendanceTrend}
            departmentPerformance={departments}
            loading={loading}
          />
          <StaffPerformanceTable attendance={attendance} tasks={tasks} loading={loading} />
        </div>
        <div className="space-y-4">
          <StaffPerformanceExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}

