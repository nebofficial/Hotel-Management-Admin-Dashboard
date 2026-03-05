"use client"

import { useEffect, useMemo, useState } from "react"
import { ClipboardList, User, CheckCircle, Clock, Sparkles, Filter, AlertTriangle, Star, RefreshCw } from "lucide-react"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/app/auth-context"
import { HousekeepingAssignmentDialog } from "@/components/rooms/housekeeping-assignment-dialog"

type AssignmentStatus = "Pending" | "In Progress" | "Completed"

interface HousekeepingAssignment {
  id: string
  roomNumber: string
  housekeeper: string
  cleaningType: string
  schedule: string | null
  status: AssignmentStatus
}

interface RoomMeta {
  roomNumber: string
  floor: number
  roomType?: string
}

interface RoomRow {
  roomNumber: string
  floor: number
  roomType?: string
  isVip: boolean
  status: AssignmentStatus | "Unassigned"
  assignedStaff: string[]
}

type SortBy = "room" | "status" | "staff"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function DailyCleaning() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<HousekeepingAssignment[]>([])
  const [rooms, setRooms] = useState<RoomMeta[]>([])
  const [staffMembers, setStaffMembers] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [autoAssignLoading, setAutoAssignLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))

  // filters & sorting
  const [floorFilter, setFloorFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [vipOnly, setVipOnly] = useState(false)
  const [staffFilter, setStaffFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortBy>("room")

  // notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadAssignments = async () => {
      if (!user?.hotelId) {
        setError("Hotel information not available. Please sign in again.")
        setLoading(false)
        return
      }
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/housekeeping-assignments`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        })
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          let message = "Failed to load housekeeping assignments"
          try {
            const data = text ? JSON.parse(text) : {}
            message = (data as any)?.message || message
          } catch {}
          throw new Error(`${message} (HTTP ${res.status})`)
        }
        const data = await res.json().catch(() => ({}))
        setAssignments((data as any).assignments || [])
        setError(null)
      } catch (err: any) {
        console.error("Error loading housekeeping assignments", err)
        setError(err.message || "Failed to load housekeeping assignments")
      } finally {
        setLoading(false)
      }
    }

    loadAssignments()
  }, [user?.hotelId, selectedDate])

  useEffect(() => {
    if (!user?.hotelId) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/rooms`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) return null
        return res.json().catch(() => null)
      })
      .then((data) => {
        if (!(data as any)?.rooms) return
        const mapped: RoomMeta[] = ((data as any).rooms || []).map((r: any) => ({
          roomNumber: String(r.roomNumber),
          floor: Number(r.floor ?? 0),
          roomType: r.roomType,
        }))
        setRooms(mapped)
      })
      .catch(() => {
        // rooms optional
      })
  }, [user?.hotelId])

  // Fetch staff from Staff Assignment module so they appear in Room cleaning overview and assignment dialog
  useEffect(() => {
    if (!user?.hotelId) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/staff-members?includeInactive=false`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) return null
        return res.json().catch(() => null)
      })
      .then((data) => {
        const list = (data as any)?.staff || []
        setStaffMembers(
          list.map((s: any) => ({
            id: String(s.id),
            name: String(s.name || "").trim(),
          })).filter((s: { id: string; name: string }) => s.name)
        )
      })
      .catch(() => {
        // staff optional
      })
  }, [user?.hotelId])

  const refetch = () => {
    // quick refetch without duplicating too much logic
    setLoading(true)
    setError(null)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/housekeeping-assignments`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          let message = "Failed to load housekeeping assignments"
          try {
            const data = text ? JSON.parse(text) : {}
            message = (data as any)?.message || message
          } catch {}
          throw new Error(`${message} (HTTP ${res.status})`)
        }
        return res.json().catch(() => ({}))
      })
      .then((data) => setAssignments((data as any).assignments || []))
      .catch((e) => setError((e as any)?.message || "Failed to load housekeeping assignments"))
      .finally(() => setLoading(false))
  }

  const getDateFromSchedule = (schedule: string | null) => {
    if (!schedule) return ""
    return schedule.slice(0, 10)
  }

  const getShiftFromSchedule = (schedule: string | null, cleaningType: string) => {
    const source = `${schedule || ""} ${cleaningType || ""}`.toLowerCase()
    if (source.includes("morning")) return "Morning"
    if (source.includes("afternoon")) return "Afternoon"
    if (source.includes("evening") || source.includes("night")) return "Night"
    return "All day"
  }

  const todaysAssignments = useMemo(
    () =>
      assignments.filter((a) => {
        const d = getDateFromSchedule(a.schedule)
        return d === selectedDate
      }),
    [assignments, selectedDate]
  )

  const staffSummary = useMemo(() => {
    const map = new Map<
      string,
      { total: number; pending: number; inProgress: number; completed: number }
    >()
    todaysAssignments.forEach((a) => {
      const key = a.housekeeper || "Unassigned"
      const entry =
        map.get(key) || { total: 0, pending: 0, inProgress: 0, completed: 0 }
      entry.total += 1
      if (a.status === "Pending") entry.pending += 1
      else if (a.status === "In Progress") entry.inProgress += 1
      else if (a.status === "Completed") entry.completed += 1
      map.set(key, entry)
    })
    return Array.from(map.entries()).map(([name, info]) => ({
      name,
      ...info,
    }))
  }, [todaysAssignments])

  const dailyScheduleRows = useMemo(() => {
    type Row = {
      staffName: string
      date: string
      shift: string
      rooms: string[]
    }
    const keyMap = new Map<string, Row>()
    todaysAssignments.forEach((a) => {
      const date = getDateFromSchedule(a.schedule) || selectedDate
      const shift = getShiftFromSchedule(a.schedule, a.cleaningType)
      const staffName = a.housekeeper || "Unassigned"
      const key = `${staffName}::${date}::${shift}`
      const existing = keyMap.get(key)
      if (existing) {
        if (!existing.rooms.includes(a.roomNumber)) {
          existing.rooms.push(a.roomNumber)
        }
      } else {
        keyMap.set(key, {
          staffName,
          date,
          shift,
          rooms: [a.roomNumber],
        })
      }
    })
    return Array.from(keyMap.values())
  }, [todaysAssignments, selectedDate])

  const pending = todaysAssignments.filter((a) => a.status === "Pending").length
  const inProgress = todaysAssignments.filter((a) => a.status === "In Progress").length
  const completed = todaysAssignments.filter((a) => a.status === "Completed").length

  // derive room rows with status + VIP flag
  const roomRows = useMemo<RoomRow[]>(() => {
    const byRoom = new Map<string, HousekeepingAssignment[]>()
    todaysAssignments.forEach((a) => {
      const list = byRoom.get(a.roomNumber) || []
      list.push(a)
      byRoom.set(a.roomNumber, list)
    })

    return rooms.map((room) => {
      const list = byRoom.get(room.roomNumber) || []
      let status: RoomRow["status"] = "Unassigned"
      if (list.length > 0) {
        const statuses = new Set(list.map((a) => a.status))
        if (statuses.has("In Progress")) status = "In Progress"
        else if (statuses.has("Pending")) status = "Pending"
        else if (statuses.has("Completed")) status = "Completed"
      }
      const assignedStaff = Array.from(
        new Set(list.map((a) => a.housekeeper).filter(Boolean))
      )
      const type = room.roomType || ""
      const typeLower = type.toLowerCase()
      const isVip = typeLower.includes("vip") || typeLower.includes("suite")
      return {
        roomNumber: room.roomNumber,
        floor: room.floor,
        roomType: room.roomType,
        isVip,
        status,
        assignedStaff,
      }
    })
  }, [rooms, todaysAssignments])

  const uniqueFloors = useMemo(
    () =>
      Array.from(new Set(rooms.map((r) => r.floor)))
        .filter((f) => !Number.isNaN(f))
        .sort((a, b) => a - b),
    [rooms]
  )

  const uniqueTypes = useMemo(
    () =>
      Array.from(new Set(rooms.map((r) => r.roomType).filter(Boolean))) as string[],
    [rooms]
  )

  // Staff for filter dropdown: from assignments today + from Staff Assignment module (unique)
  const staffOptions = useMemo(() => {
    const fromAssignments = staffSummary
      .map((s) => s.name)
      .filter((n) => n && n !== "Unassigned")
    const fromStaffModule = staffMembers.map((s) => s.name)
    const combined = Array.from(new Set([...fromAssignments, ...fromStaffModule]))
    return combined.sort((a, b) => a.localeCompare(b))
  }, [staffSummary, staffMembers])

  // Staff names to use for auto-assign: prefer Staff Assignment list so new staff are included
  const availableStaffNamesForAutoAssign = useMemo(() => {
    if (staffMembers.length > 0) {
      return staffMembers.map((s) => s.name)
    }
    return staffSummary
      .map((s) => s.name)
      .filter((n) => n && n !== "Unassigned")
  }, [staffMembers, staffSummary])

  const filteredRooms = useMemo(() => {
    let rows = roomRows
    if (floorFilter !== "all") {
      const floorNum = Number(floorFilter)
      rows = rows.filter((r) => r.floor === floorNum)
    }
    if (typeFilter !== "all") {
      rows = rows.filter((r) => (r.roomType || "") === typeFilter)
    }
    if (vipOnly) {
      rows = rows.filter((r) => r.isVip)
    }
    if (staffFilter !== "all") {
      rows = rows.filter((r) => r.assignedStaff.includes(staffFilter))
    }

    const statusRank: Record<RoomRow["status"], number> = {
      Pending: 1,
      "In Progress": 2,
      Completed: 3,
      Unassigned: 4,
    }

    return [...rows].sort((a, b) => {
      if (sortBy === "room") {
        const an = Number(a.roomNumber)
        const bn = Number(b.roomNumber)
        if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn
        return a.roomNumber.localeCompare(b.roomNumber)
      }
      if (sortBy === "status") {
        return statusRank[a.status] - statusRank[b.status]
      }
      if (sortBy === "staff") {
        const as = a.assignedStaff[0] || ""
        const bs = b.assignedStaff[0] || ""
        return as.localeCompare(bs)
      }
      return 0
    })
  }, [roomRows, floorFilter, typeFilter, vipOnly, staffFilter, sortBy])

  const overdueCount = useMemo(() => {
    const todayNum = Number(selectedDate.replace(/-/g, ""))
    return assignments.filter((a) => {
      const d = getDateFromSchedule(a.schedule)
      if (!d) return false
      const n = Number(d.replace(/-/g, ""))
      return n < todayNum && a.status !== "Completed"
    }).length
  }, [assignments, selectedDate])

  const recentCompleted = useMemo(
    () =>
      assignments
        .filter((a) => a.status === "Completed")
        .sort((a, b) => {
          const da = getDateFromSchedule(a.schedule)
          const db = getDateFromSchedule(b.schedule)
          return db.localeCompare(da)
        })
        .slice(0, 8),
    [assignments]
  )

  const autoDistribute = async () => {
    if (!user?.hotelId) return
    if (autoAssignLoading) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    const staffNames = availableStaffNamesForAutoAssign
    if (staffNames.length === 0) {
      setError(
        "No staff available to auto-assign. Add staff in Staff Assignment (Housekeeping → Staff Assignment) or create at least one assignment first."
      )
      return
    }
    setAutoAssignLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const assignedRoomsToday = new Set(todaysAssignments.map((a) => String(a.roomNumber)))
      const candidateRooms = rooms.filter(
        (r) => !assignedRoomsToday.has(String(r.roomNumber))
      )
      if (candidateRooms.length === 0) {
        setAlertMessage("All rooms already have tasks for the selected date.")
        return
      }
      const base = {
        cleaningType: "Daily clean",
        status: "Pending" as AssignmentStatus,
        schedule: `${selectedDate} - Daily`,
      }
      const tasks: Promise<Response>[] = []
      candidateRooms.forEach((room, index) => {
        const staff = staffNames[index % staffNames.length]
        const payload = {
          ...base,
          roomNumber: String(room.roomNumber),
          housekeeper: staff,
        }
        tasks.push(
          fetch(
            `${API_BASE}/api/hotel-data/${user.hotelId}/housekeeping-assignments`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          )
        )
      })
      await Promise.allSettled(tasks)
      setSuccessMessage("Rooms auto-assigned across available staff for the selected date.")
      refetch()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to auto-assign rooms. Please try again."
      )
    } finally {
      setAutoAssignLoading(false)
    }
  }

  const markRoomCleaned = async (roomNumber: string) => {
    if (!user?.hotelId) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    const tasksForRoomToday = todaysAssignments.filter(
      (a) => a.roomNumber === roomNumber && a.status !== "Completed"
    )
    if (tasksForRoomToday.length === 0) {
      setAlertMessage("No pending tasks for this room on the selected date.")
      return
    }
    try {
      setSuccessMessage(null)
      setAlertMessage(null)
      const tasks: Promise<Response>[] = []
      tasksForRoomToday.forEach((task) => {
        tasks.push(
          fetch(
            `${API_BASE}/api/hotel-data/${user.hotelId}/housekeeping-assignments/${task.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "Completed" }),
            }
          )
        )
      })
      await Promise.allSettled(tasks)
      setSuccessMessage(`Room ${roomNumber} marked as cleaned.`)
      refetch()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to mark room as cleaned. Please try again."
      )
    }
  }

  return (
    <main className="p-4 space-y-6 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <RoomSectionHeader
        icon={ClipboardList}
        title="Daily Cleaning Schedule"
        description="Assign staff, manage shifts, and monitor room cleaning status across the hotel."
        action={
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <div className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-[11px] text-gray-500">Filters</span>
            </div>
            <input
              type="date"
              aria-label="Select housekeeping date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 shadow-sm"
            />
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={refetch}
              disabled={loading || !user?.hotelId}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              onClick={autoDistribute}
              disabled={autoAssignLoading || !user?.hotelId}
            >
              <Sparkles className="h-4 w-4" />
              {autoAssignLoading ? "Distributing…" : "Auto-assign rooms"}
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setAssignOpen(true)}
            >
              Assign housekeeping
            </Button>
          </div>
        }
      />

      {user?.hotelId && (
        <HousekeepingAssignmentDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          hotelId={user.hotelId}
          onSuccess={refetch}
          staffList={staffMembers}
        />
      )}

      {(error || successMessage || alertMessage) && (
        <div className="space-y-1 text-xs">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {alertMessage && !error && (
            <div className="rounded-md bg-amber-50 border border-amber-100 px-3 py-2 text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{alertMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2 text-emerald-800 text-xs">
              {successMessage}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Assignments today</p>
              <p className="text-xl font-bold text-gray-900">{todaysAssignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending</p>
              <p className="text-xl font-bold text-amber-600">{pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">In progress</p>
              <p className="text-xl font-bold text-blue-600">{inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Completed</p>
              <p className="text-xl font-bold text-green-600">{completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gray-500" />
              Room cleaning overview
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
              <select
                aria-label="Filter by floor"
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="h-7 rounded-md border border-gray-200 bg-white px-2"
              >
                <option value="all">All floors</option>
                {uniqueFloors.map((f) => (
                  <option key={f} value={String(f)}>
                    Floor {f}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by room type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-7 rounded-md border border-gray-200 bg-white px-2"
              >
                <option value="all">All types</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by staff"
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="h-7 rounded-md border border-gray-200 bg-white px-2"
              >
                <option value="all">All staff</option>
                {staffOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3"
                  checked={vipOnly}
                  onChange={(e) => setVipOnly(e.target.checked)}
                />
                VIP only
              </label>
              <select
                aria-label="Sort rooms"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="h-7 rounded-md border border-gray-200 bg-white px-2"
              >
                <option value="room">Sort: Room</option>
                <option value="status">Sort: Status</option>
                <option value="staff">Sort: Staff</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-xs md:text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Room</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Floor</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Assigned staff</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-sm text-gray-500"
                      >
                        Loading schedule…
                      </td>
                    </tr>
                  ) : filteredRooms.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-sm text-gray-500"
                      >
                        No rooms match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((row) => {
                      let statusLabel = "Unassigned"
                      let statusClass = "bg-gray-100 text-gray-700"
                      if (row.status === "Completed") {
                        statusLabel = "Cleaned"
                        statusClass = "bg-green-100 text-green-800"
                      } else if (row.status === "In Progress") {
                        statusLabel = "In Progress"
                        statusClass = "bg-blue-100 text-blue-800"
                      } else if (row.status === "Pending") {
                        statusLabel = "Pending"
                        statusClass = "bg-amber-100 text-amber-800"
                      }

                      return (
                        <tr
                          key={row.roomNumber}
                          className="border-b border-gray-100 hover:bg-gray-50/60"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900 flex items-center gap-1.5">
                            <span>Room {row.roomNumber}</span>
                            {row.isVip && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5">
                                <Star className="h-3 w-3" />
                                VIP
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-700">{row.floor}</td>
                          <td className="px-3 py-2 text-gray-700">{row.roomType || "-"}</td>
                          <td className="px-3 py-2">
                            <Badge className={statusClass}>{statusLabel}</Badge>
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {row.assignedStaff.length > 0
                              ? row.assignedStaff.join(", ")
                              : "Unassigned"}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[11px]"
                              disabled={row.status === "Completed" || !user?.hotelId}
                              onClick={() => markRoomCleaned(row.roomNumber)}
                            >
                              Mark cleaned
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Staff workload today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-1.5 text-xs">
              {staffSummary.length === 0 ? (
                <p className="text-gray-500 text-xs">No housekeeping tasks scheduled.</p>
              ) : (
                staffSummary.map((s) => {
                  let colorClass = "bg-gray-100 text-gray-800"
                  if (s.total >= 10) colorClass = "bg-red-100 text-red-800"
                  else if (s.total >= 6) colorClass = "bg-amber-100 text-amber-800"
                  else colorClass = "bg-emerald-100 text-emerald-800"
                  return (
                    <div
                      key={s.name}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{s.name}</span>
                        <span className="text-[11px] text-gray-500">
                          {s.pending} pending • {s.inProgress} in progress • {s.completed} done
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colorClass}`}>
                        {s.total} rooms
                      </span>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Alerts & integration</CardTitle>
              {overdueCount > 0 && (
                <span className="text-[11px] font-medium text-red-700 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                  {overdueCount} overdue
                </span>
              )}
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2 text-xs">
              <p className="text-gray-600">
                Overdue rooms and today&apos;s pending tasks should be prioritized for inspection
                and linen replacement.
              </p>
              <div className="space-y-1.5">
                <Link
                  href="/housekeeping/inspection"
                  className="flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5 hover:bg-gray-50"
                >
                  <span className="text-[11px] font-medium text-gray-800">
                    Room inspection checklist
                  </span>
                  <span className="text-[11px] text-blue-600">Open</span>
                </Link>
                <Link
                  href="/housekeeping/linen"
                  className="flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5 hover:bg-gray-50"
                >
                  <span className="text-[11px] font-medium text-gray-800">
                    Check linen inventory
                  </span>
                  <span className="text-[11px] text-blue-600">Open</span>
                </Link>
                <Link
                  href="/guests"
                  className="flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5 hover:bg-gray-50"
                >
                  <span className="text-[11px] font-medium text-gray-800">
                    Prioritize occupied / VIP rooms
                  </span>
                  <span className="text-[11px] text-blue-600">Open CRM</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Recent cleaning history</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 text-xs space-y-1.5">
              {recentCompleted.length === 0 ? (
                <p className="text-gray-500">No completed tasks yet.</p>
              ) : (
                recentCompleted.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        Room {a.roomNumber} • {a.housekeeper || "Unassigned"}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {getDateFromSchedule(a.schedule) || "—"} • {a.cleaningType}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                      Cleaned
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

