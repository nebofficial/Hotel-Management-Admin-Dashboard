'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { AttendanceHeader } from './AttendanceHeader'
import { AttendanceStatsCards } from './AttendanceStatsCards'
import { AttendanceSearchBar } from './AttendanceSearchBar'
import { AttendanceFilters } from './AttendanceFilters'
import { AttendanceTable } from './AttendanceTable'
import { AttendanceCalendar } from './AttendanceCalendar'
import { LateCheckinPanel } from './LateCheckinPanel'
import { EarlyCheckoutPanel } from './EarlyCheckoutPanel'
import { AttendanceReportPanel } from './AttendanceReportPanel'
import { AttendancePagination } from './AttendancePagination'
import { MarkAttendanceModal } from './MarkAttendanceModal'
import { fetchAttendanceCalendar, fetchAttendanceList, fetchDailyAttendance } from '@/services/api/attendanceApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function AttendancePage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [filters, setFilters] = useState(() => ({
    date: new Date().toISOString().slice(0, 10),
    department: 'all',
    shift: 'all',
  }))
  const [search, setSearch] = useState('')
  const [summary, setSummary] = useState(null)
  const [records, setRecords] = useState([])
  const [calendarDays, setCalendarDays] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const [markOpen, setMarkOpen] = useState(false)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const [daily, list] = await Promise.all([
        fetchDailyAttendance(apiBase, {
          date: filters.date,
          department: filters.department,
        }),
        fetchAttendanceList(apiBase, {
          date: filters.date,
          department: filters.department,
          page,
          pageSize,
        }),
      ])
      setSummary(daily.summary || null)
      const filtered = (list.list || []).filter((r) =>
        search ? String(r.staffName || '').toLowerCase().includes(search.toLowerCase()) : true,
      )
      setRecords(filtered)
      setTotal(list.pagination?.total || filtered.length)

      const month = (filters.date || new Date().toISOString().slice(0, 10)).slice(0, 7)
      const cal = await fetchAttendanceCalendar(apiBase, { month })
      setCalendarDays(cal.days || [])
    } catch (err) {
      console.error('Attendance load error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, filters.date, filters.department, page])

  useEffect(() => {
    // refilter on search without refetch
    if (!apiBase) return
    const refilter = async () => {
      try {
        const list = await fetchAttendanceList(apiBase, {
          date: filters.date,
          department: filters.department,
          page,
          pageSize,
        })
        const filtered = (list.list || []).filter((r) =>
          search ? String(r.staffName || '').toLowerCase().includes(search.toLowerCase()) : true,
        )
        setRecords(filtered)
        setTotal(list.pagination?.total || filtered.length)
      } catch {
        // ignore
      }
    }
    refilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const monthLabel = filters.date ? new Date(filters.date).toLocaleString(undefined, { month: 'long', year: 'numeric' }) : ''

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view attendance.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <AttendanceHeader onMarkToday={() => setMarkOpen(true)} />

      <AttendanceStatsCards summary={summary} />

      <AttendanceSearchBar value={search} onChange={setSearch} />

      <AttendanceFilters filters={filters} onChange={setFilters} />

      <div className="grid gap-4 lg:grid-cols-[2fr,1.2fr]">
        <div className="space-y-3">
          <AttendanceTable records={records} loading={loading} />
          <AttendancePagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
        </div>
        <div className="space-y-3">
          <AttendanceCalendar
            monthLabel={monthLabel}
            days={calendarDays}
            onSelectDate={(d) => setFilters((f) => ({ ...f, date: d }))}
          />
          <LateCheckinPanel records={records} />
          <EarlyCheckoutPanel records={records} />
          <AttendanceReportPanel apiBase={apiBase} />
        </div>
      </div>

      <MarkAttendanceModal
        open={markOpen}
        onOpenChange={setMarkOpen}
        hotelId={effectiveHotelId}
        date={filters.date}
        onMarked={load}
      />
    </div>
  )
}

