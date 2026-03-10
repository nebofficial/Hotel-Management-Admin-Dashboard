'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { ShiftHeader } from './ShiftHeader'
import { ShiftStatsCards } from './ShiftStatsCards'
import { ShiftListTable } from './ShiftListTable'
import { ShiftCalendarView } from './ShiftCalendarView'
import { ShiftRotationPanel } from './ShiftRotationPanel'
import { NightShiftManager } from './NightShiftManager'
import { ShiftChangeRequestPanel } from './ShiftChangeRequestPanel'
import { ShiftExportButton } from './ShiftExportButton'
import { CreateShiftModal } from './CreateShiftModal'
import { EditShiftModal } from './EditShiftModal'
import { AssignShiftModal } from './AssignShiftModal'
import {
  fetchShifts,
  createShift,
  updateShift,
  assignShiftToStaff,
  fetchShiftSchedule,
  fetchShiftChangeRequests,
  approveShiftChange,
  rejectShiftChange,
  exportShiftSchedule,
  fetchStaff,
} from '@/services/api/shiftManagementApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function ShiftManagementPage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [shifts, setShifts] = useState([])
  const [staff, setStaff] = useState([])
  const [schedule, setSchedule] = useState({ days: [], shifts: [] })
  const [changeRequests, setChangeRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - (day === 0 ? 6 : day - 1)
    return new Date(d.setDate(diff)).toISOString().slice(0, 10)
  })

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const [shiftsRes, scheduleRes, requestsRes, staffRes] = await Promise.all([
        fetchShifts(apiBase),
        fetchShiftSchedule(apiBase, { weekStart }),
        fetchShiftChangeRequests(apiBase),
        fetchStaff(apiBase),
      ])
      setShifts(shiftsRes.shifts || [])
      setSchedule(scheduleRes)
      setChangeRequests(requestsRes.requests || [])
      setStaff(staffRes.staff || [])
    } catch (err) {
      console.error('ShiftManagement load error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, weekStart])

  const handleCreateShift = async (payload) => {
    if (!apiBase) return
    await createShift(apiBase, payload)
    await load()
  }

  const handleUpdateShift = async (shiftId, payload) => {
    if (!apiBase) return
    await updateShift(apiBase, shiftId, payload)
    await load()
  }

  const handleAssignShift = async (payload) => {
    if (!apiBase) return
    await assignShiftToStaff(apiBase, payload)
    await load()
  }

  const handleApprove = async (requestId) => {
    if (!apiBase) return
    await approveShiftChange(apiBase, requestId)
    await load()
  }

  const handleReject = async (requestId) => {
    if (!apiBase) return
    await rejectShiftChange(apiBase, requestId)
    await load()
  }

  const handleExport = async (base, params) => {
    const res = await exportShiftSchedule(base, params)
    return res
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to manage shifts.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-amber-50/25">
      <ShiftHeader onCreate={() => setCreateOpen(true)} />

      <ShiftStatsCards shifts={shifts} schedule={schedule} changeRequests={changeRequests} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <ShiftListTable
            shifts={shifts}
            loading={loading}
            onEdit={(s) => {
              setSelectedShift(s)
              setEditOpen(true)
            }}
            onAssign={(s) => {
              setSelectedShift(s)
              setAssignOpen(true)
            }}
          />
          <ShiftCalendarView schedule={schedule} loading={loading} />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[11px] text-slate-600">Week of</label>
            <input
              type="date"
              className="h-8 rounded border border-slate-200 text-xs px-2"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
            />
          </div>
          <ShiftExportButton apiBase={apiBase} weekStart={weekStart} onExport={handleExport} />
          <ShiftRotationPanel shifts={shifts} />
          <NightShiftManager shifts={shifts} />
          <ShiftChangeRequestPanel
            requests={changeRequests}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>

      <CreateShiftModal open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreateShift} />
      <EditShiftModal open={editOpen} onOpenChange={setEditOpen} shift={selectedShift} onSubmit={handleUpdateShift} />
      <AssignShiftModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        shift={selectedShift}
        staff={staff}
        onSubmit={handleAssignShift}
      />
    </div>
  )
}
