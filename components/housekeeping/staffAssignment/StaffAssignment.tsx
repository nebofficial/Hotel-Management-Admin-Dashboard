"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CalendarDays, Users, Activity, Clock, RefreshCw } from "lucide-react"
import { RoleManagement } from "./RoleManagement"
import { ShiftManagement } from "./ShiftManagement"
import { WorkloadBalancing } from "./WorkloadBalancing"
import { AttendanceTracking } from "./AttendanceTracking"
import { PerformanceTracking } from "./PerformanceTracking"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type StaffRole = "Housekeeping" | "Laundry" | "Inspector" | "Supervisor" | "Other"
export type StaffShift = "Morning" | "Afternoon" | "Night"
export type AttendanceStatus = "Present" | "Absent" | "On Leave" | "Off"

export interface StaffMemberRecord {
  id: string
  name: string
  role: StaffRole
  department: string | null
  primaryArea: string | null
  roomNo: string | null
  floor: string | null
  isActive: boolean
  colorTag: string | null
}

export interface StaffScheduleRecord {
  id: string
  staffId: string
  staffName: string
  date: string
  shift: StaffShift
  role: StaffRole
  assignedRooms: number
  assignedTasks: number
  workloadScore: number
  attendanceStatus: AttendanceStatus
  hoursWorked: number
  overtimeHours: number
  performanceScore: number
  inspectionsPassed: number
  inspectionsFailed: number
  notes: string | null
}

export default function StaffAssignment() {
  const { user } = useAuth()
  const [staff, setStaff] = useState<StaffMemberRecord[]>([])
  const [schedules, setSchedules] = useState<StaffScheduleRecord[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().slice(0, 10),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!user?.hotelId) {
        setError("Hotel information not available. Please sign in again.")
        setLoading(false)
        return
      }
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setError("Not authenticated. Please log in again.")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [staffRes, scheduleRes] = await Promise.all([
          fetch(
            `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members?includeInactive=true`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          fetch(
            `${API_BASE}/api/hotel-data/${user.hotelId}/staff-schedules?date=${selectedDate}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ])

        const staffJson = staffRes.ok
          ? await staffRes.json().catch(() => ({}))
          : {}
        const scheduleJson = scheduleRes.ok
          ? await scheduleRes.json().catch(() => ({}))
          : {}

        const staffList = (staffJson as any).staff || []
        const mappedStaff: StaffMemberRecord[] = staffList.map((s: any) => ({
          id: String(s.id),
          name: String(s.name),
          role: (s.role as StaffRole) || "Housekeeping",
          department: s.department ? String(s.department) : null,
          primaryArea: s.primaryArea ? String(s.primaryArea) : null,
          roomNo: s.roomNo != null ? String(s.roomNo) : null,
          floor: s.floor != null ? String(s.floor) : null,
          isActive: s.isActive !== false,
          colorTag: s.colorTag ? String(s.colorTag) : null,
        }))
        setStaff(mappedStaff)

        const scheduleList = (scheduleJson as any).schedules || []
        const mappedSchedules: StaffScheduleRecord[] = scheduleList.map((sc: any) => ({
          id: String(sc.id),
          staffId: String(sc.staffId),
          staffName: String(sc.staffName),
          date: String(sc.date || selectedDate),
          shift: (sc.shift as StaffShift) || "Morning",
          role: (sc.role as StaffRole) || "Housekeeping",
          assignedRooms: Number(sc.assignedRooms || 0),
          assignedTasks: Number(sc.assignedTasks || 0),
          workloadScore: Number(sc.workloadScore || 0),
          attendanceStatus: (sc.attendanceStatus as AttendanceStatus) || "Present",
          hoursWorked: Number(sc.hoursWorked || 0),
          overtimeHours: Number(sc.overtimeHours || 0),
          performanceScore: Number(sc.performanceScore || 0),
          inspectionsPassed: Number(sc.inspectionsPassed || 0),
          inspectionsFailed: Number(sc.inspectionsFailed || 0),
          notes: sc.notes ? String(sc.notes) : null,
        }))
        setSchedules(mappedSchedules)
      } catch (e: any) {
        console.error(e)
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load staff assignment data.",
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user?.hotelId, selectedDate])

  const refreshSchedules = async () => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/staff-schedules?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) return
      const data = await res.json().catch(() => ({}))
      const list = (data as any).schedules || []
      const mapped: StaffScheduleRecord[] = list.map((sc: any) => ({
        id: String(sc.id),
        staffId: String(sc.staffId),
        staffName: String(sc.staffName),
        date: String(sc.date || selectedDate),
        shift: (sc.shift as StaffShift) || "Morning",
        role: (sc.role as StaffRole) || "Housekeeping",
        assignedRooms: Number(sc.assignedRooms || 0),
        assignedTasks: Number(sc.assignedTasks || 0),
        workloadScore: Number(sc.workloadScore || 0),
        attendanceStatus: (sc.attendanceStatus as AttendanceStatus) || "Present",
        hoursWorked: Number(sc.hoursWorked || 0),
        overtimeHours: Number(sc.overtimeHours || 0),
        performanceScore: Number(sc.performanceScore || 0),
        inspectionsPassed: Number(sc.inspectionsPassed || 0),
        inspectionsFailed: Number(sc.inspectionsFailed || 0),
        notes: sc.notes ? String(sc.notes) : null,
      }))
      setSchedules(mapped)
    } catch {
      // ignore
    }
  }

  const refreshAll = async () => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    setError(null)
    setLoading(true)
    try {
      const [staffRes, scheduleRes] = await Promise.all([
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members?includeInactive=true`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/staff-schedules?date=${selectedDate}`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ])
      const staffJson = staffRes.ok ? await staffRes.json().catch(() => ({})) : {}
      const scheduleJson = scheduleRes.ok ? await scheduleRes.json().catch(() => ({})) : {}
      const staffList = (staffJson as any).staff || []
      setStaff(
        staffList.map((s: any) => ({
          id: String(s.id),
          name: String(s.name),
          role: (s.role as StaffRole) || "Housekeeping",
          department: s.department ? String(s.department) : null,
          primaryArea: s.primaryArea ? String(s.primaryArea) : null,
          roomNo: s.roomNo != null ? String(s.roomNo) : null,
          floor: s.floor != null ? String(s.floor) : null,
          isActive: s.isActive !== false,
          colorTag: s.colorTag ? String(s.colorTag) : null,
        }))
      )
      const scheduleList = (scheduleJson as any).schedules || []
      setSchedules(
        scheduleList.map((sc: any) => ({
          id: String(sc.id),
          staffId: String(sc.staffId),
          staffName: String(sc.staffName),
          date: String(sc.date || selectedDate),
          shift: (sc.shift as StaffShift) || "Morning",
          role: (sc.role as StaffRole) || "Housekeeping",
          assignedRooms: Number(sc.assignedRooms || 0),
          assignedTasks: Number(sc.assignedTasks || 0),
          workloadScore: Number(sc.workloadScore || 0),
          attendanceStatus: (sc.attendanceStatus as AttendanceStatus) || "Present",
          hoursWorked: Number(sc.hoursWorked || 0),
          overtimeHours: Number(sc.overtimeHours || 0),
          performanceScore: Number(sc.performanceScore || 0),
          inspectionsPassed: Number(sc.inspectionsPassed || 0),
          inspectionsFailed: Number(sc.inspectionsFailed || 0),
          notes: sc.notes ? String(sc.notes) : null,
        }))
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStaff = async (payload: {
    name: string
    role: StaffRole
    department?: string
    primaryArea?: string
    roomNo?: string
    floor?: string
    colorTag?: string
  }) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setCreating(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message ||
            `Failed to create staff member (${res.status})`,
        )
      }
      // Refresh staff list (include inactive so we show all data)
      const staffRes = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members?includeInactive=true`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (staffRes.ok) {
        const data = await staffRes.json().catch(() => ({}))
        const list = (data as any).staff || []
        setStaff(
          list.map((s: any) => ({
            id: String(s.id),
            name: String(s.name),
            role: (s.role as StaffRole) || "Housekeeping",
            department: s.department ? String(s.department) : null,
            primaryArea: s.primaryArea ? String(s.primaryArea) : null,
            roomNo: s.roomNo != null ? String(s.roomNo) : null,
            floor: s.floor != null ? String(s.floor) : null,
            isActive: s.isActive !== false,
            colorTag: s.colorTag ? String(s.colorTag) : null,
          }))
        )
      }
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to create staff member. Try again.",
      )
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateStaff = async (
    id: string,
    updates: Partial<{
      name: string
      role: StaffRole
      department: string | null
      primaryArea: string | null
      roomNo: string | null
      floor: string | null
      colorTag: string | null
      isActive: boolean
    }>,
  ) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message ||
            `Failed to update staff member (${res.status})`,
        )
      }
      // Refresh staff list (include inactive)
      const staffRes = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members?includeInactive=true`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (staffRes.ok) {
        const data = await staffRes.json().catch(() => ({}))
        const list = (data as any).staff || []
        setStaff(
          list.map((s: any) => ({
            id: String(s.id),
            name: String(s.name),
            role: (s.role as StaffRole) || "Housekeeping",
            department: s.department ? String(s.department) : null,
            primaryArea: s.primaryArea ? String(s.primaryArea) : null,
            roomNo: s.roomNo != null ? String(s.roomNo) : null,
            floor: s.floor != null ? String(s.floor) : null,
            isActive: s.isActive !== false,
            colorTag: s.colorTag ? String(s.colorTag) : null,
          }))
        )
      }
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to update staff member. Try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStaff = async (id: string) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message ||
            `Failed to delete staff member (${res.status})`,
        )
      }
      // Refresh staff list (include inactive)
      const staffRes = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members?includeInactive=true`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (staffRes.ok) {
        const data = await staffRes.json().catch(() => ({}))
        const list = (data as any).staff || []
        setStaff(
          list.map((s: any) => ({
            id: String(s.id),
            name: String(s.name),
            role: (s.role as StaffRole) || "Housekeeping",
            department: s.department ? String(s.department) : null,
            primaryArea: s.primaryArea ? String(s.primaryArea) : null,
            roomNo: s.roomNo != null ? String(s.roomNo) : null,
            floor: s.floor != null ? String(s.floor) : null,
            isActive: s.isActive !== false,
            colorTag: s.colorTag ? String(s.colorTag) : null,
          }))
        )
      }
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to delete staff member. Try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSchedule = async (
    record: Partial<StaffScheduleRecord> & {
      staffId: string
      staffName: string
      date: string
    },
  ) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const { id, ...rest } = record
      const basePayload = {
        staffId: rest.staffId,
        staffName: rest.staffName,
        date: rest.date,
        shift: rest.shift ?? "Morning",
        role: rest.role ?? "Housekeeping",
        assignedRooms: rest.assignedRooms ?? 0,
        assignedTasks: rest.assignedTasks ?? 0,
        workloadScore: rest.workloadScore ?? 0,
        attendanceStatus: rest.attendanceStatus ?? "Present",
        hoursWorked: rest.hoursWorked ?? 0,
        overtimeHours: rest.overtimeHours ?? 0,
        performanceScore: rest.performanceScore ?? 0,
        inspectionsPassed: rest.inspectionsPassed ?? 0,
        inspectionsFailed: rest.inspectionsFailed ?? 0,
        notes: rest.notes ?? null,
      }

      const url = id
        ? `${API_BASE}/api/hotel-data/${user.hotelId}/staff-schedules/${id}`
        : `${API_BASE}/api/hotel-data/${user.hotelId}/staff-schedules`

      const method = id ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(basePayload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message ||
            `Failed to save staff schedule (${res.status})`,
        )
      }

      await refreshSchedules()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to save staff schedule. Try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  const roleSummary = useMemo(() => {
    const counts: Record<StaffRole, number> = {
      Housekeeping: 0,
      Laundry: 0,
      Inspector: 0,
      Supervisor: 0,
      Other: 0,
    }
    staff.forEach((s) => {
      counts[s.role] = (counts[s.role] || 0) + 1
    })
    return counts
  }, [staff])

  if (loading) {
    return (
      <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <div className="pb-1">
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            Staff assignment & scheduling
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Loading staff and schedule data…</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-xl border border-slate-200 bg-white animate-pulse">
              <CardContent className="p-3 h-16" />
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl border border-slate-200 bg-white">
          <CardContent className="p-6 flex items-center justify-center text-sm text-slate-500">
            Loading staff list and schedules from backend…
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="pb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            Staff assignment & scheduling
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage roles, shifts, workload balancing, attendance, and performance
            for your housekeeping, laundry, and inspection teams.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-indigo-500 inline mr-1" />
            Date: <span className="font-medium text-slate-800">{selectedDate}</span>
          </span>
          <button
            type="button"
            onClick={refreshAll}
            disabled={loading || !user?.hotelId}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Total staff
            </span>
            <span className="text-lg font-semibold">
              {staff.length.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Housekeeping
            </span>
            <span className="text-lg font-semibold">
              {roleSummary.Housekeeping.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Laundry
            </span>
            <span className="text-lg font-semibold">
              {roleSummary.Laundry.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Supervisors
            </span>
            <span className="text-lg font-semibold">
              {roleSummary.Supervisor.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-3 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="roles" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
          <TabsTrigger value="roles" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Shifts
          </TabsTrigger>
          <TabsTrigger value="workload" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Workload
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-3">
          <RoleManagement
            staff={staff}
            creating={creating}
            saving={saving}
            onCreate={handleCreateStaff}
            onUpdate={handleUpdateStaff}
            onDelete={handleDeleteStaff}
          />
        </TabsContent>

        <TabsContent value="shifts" className="space-y-3">
          <ShiftManagement
            date={selectedDate}
            onChangeDate={setSelectedDate}
            staff={staff}
            schedules={schedules}
            saving={saving}
            onSaveSchedule={handleSaveSchedule}
          />
        </TabsContent>

        <TabsContent value="workload" className="space-y-3">
          <WorkloadBalancing
            date={selectedDate}
            staff={staff}
            schedules={schedules}
            saving={saving}
            onSaveSchedule={handleSaveSchedule}
          />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-3">
          <AttendanceTracking
            date={selectedDate}
            staff={staff}
            schedules={schedules}
            saving={saving}
            onSaveSchedule={handleSaveSchedule}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-3">
          <PerformanceTracking staff={staff} schedules={schedules} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

