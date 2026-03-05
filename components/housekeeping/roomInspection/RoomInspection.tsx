"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, RefreshCw, CalendarDays } from "lucide-react"
import { InspectionSchedule, ScheduleRoomMeta, ShiftOption } from "./InspectionSchedule"
import { ChecklistManagement, InspectionChecklist } from "./ChecklistManagement"
import { StatusTracking, InspectionStatus } from "./StatusTracking"
import { IssueReporting } from "./IssueReporting"
import { PerformanceMonitoring } from "./PerformanceMonitoring"
import { HistoricalAnalytics } from "./HistoricalAnalytics"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface InspectionRecord {
  id: string
  roomNumber: string
  floor: number | null
  roomType?: string | null
  inspector: string
  scheduledDate: string
  shift: ShiftOption
  status: InspectionStatus
  checklist?: InspectionChecklist | null
  issuesSummary?: string | null
  issuesCount: number
  cleanedBy?: string | null
}

export default function RoomInspection() {
  const { user } = useAuth()
  const [inspections, setInspections] = useState<InspectionRecord[]>([])
  const [rooms, setRooms] = useState<ScheduleRoomMeta[]>([])
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [savingChecklist, setSavingChecklist] = useState(false)
  const [savingIssues, setSavingIssues] = useState(false)
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null)

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
        const [insRes, roomRes] = await Promise.all([
          fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/inspections`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/rooms`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ])

        const insJson = insRes.ok ? await insRes.json().catch(() => ({})) : {}
        const roomJson = roomRes.ok ? await roomRes.json().catch(() => ({})) : {}

        const list = (insJson as any).inspections || []
        const mappedInspections: InspectionRecord[] = list.map((i: any) => ({
          id: String(i.id),
          roomNumber: String(i.roomNumber),
          floor:
            i.floor !== null && i.floor !== undefined ? Number(i.floor) : null,
          roomType: i.roomType ?? null,
          inspector: i.inspector || "—",
          scheduledDate: i.scheduledDate || "",
          shift: (i.shift as ShiftOption) || "All day",
          status: (i.status as InspectionStatus) || "Pending",
          checklist: (i.checklist as InspectionChecklist) || undefined,
          issuesSummary: i.issuesSummary ?? null,
          issuesCount: Number(i.issuesCount || 0),
          cleanedBy: i.cleanedBy ?? null,
        }))
        setInspections(mappedInspections)

        const roomList = (roomJson as any).rooms || []
        const mappedRooms: ScheduleRoomMeta[] = roomList.map((r: any) => ({
          roomNumber: String(r.roomNumber),
          floor:
            r.floor !== null && r.floor !== undefined ? Number(r.floor) : null,
          roomType: r.roomType ?? null,
        }))
        setRooms(mappedRooms)

        if (!activeInspectionId && mappedInspections.length > 0) {
          setActiveInspectionId(mappedInspections[0].id)
        }
      } catch (e: any) {
        console.error(e)
        setError(
          e instanceof Error ? e.message : "Failed to load inspections and rooms.",
        )
      } finally {
        setLoading(false)
      }
    }

    load()
    // we intentionally ignore activeInspectionId in deps for initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hotelId])

  const refreshInspections = async () => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/inspections`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) return
      const data = await res.json().catch(() => ({}))
      const list = (data as any).inspections || []
      const mapped: InspectionRecord[] = list.map((i: any) => ({
        id: String(i.id),
        roomNumber: String(i.roomNumber),
        floor:
          i.floor !== null && i.floor !== undefined ? Number(i.floor) : null,
        roomType: i.roomType ?? null,
        inspector: i.inspector || "—",
        scheduledDate: i.scheduledDate || "",
        shift: (i.shift as ShiftOption) || "All day",
        status: (i.status as InspectionStatus) || "Pending",
        checklist: (i.checklist as InspectionChecklist) || undefined,
        issuesSummary: i.issuesSummary ?? null,
        issuesCount: Number(i.issuesCount || 0),
        cleanedBy: i.cleanedBy ?? null,
      }))
      setInspections(mapped)
      if (!activeInspectionId && mapped.length > 0) {
        setActiveInspectionId(mapped[0].id)
      }
    } catch {
      // ignore
    }
  }

  const todaysInspections = useMemo(
    () =>
      inspections.filter((i) => i.scheduledDate === selectedDate),
    [inspections, selectedDate],
  )

  const handleCreate = async (payload: {
    roomNumber: string
    inspector: string
    scheduledDate: string
    shift: ShiftOption
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
        `${API_BASE}/api/hotel-data/${user.hotelId}/inspections`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomNumber: payload.roomNumber,
            inspector: payload.inspector,
            scheduledDate: payload.scheduledDate,
            shift: payload.shift,
          }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to schedule inspection (${res.status})`,
        )
      }
      await refreshInspections()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to schedule inspection. Try again.",
      )
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateChecklist = async (
    id: string,
    checklist: InspectionChecklist,
  ) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSavingChecklist(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/inspections/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checklist }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message ||
            `Failed to update checklist (${res.status})`,
        )
      }
      await refreshInspections()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to update checklist. Try again.",
      )
    } finally {
      setSavingChecklist(false)
    }
  }

  const handleUpdateIssues = async (
    id: string,
    updates: { issuesSummary: string; issuesCount: number; status?: string },
  ) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSavingIssues(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/inspections/${id}`,
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
            `Failed to update inspection issues (${res.status})`,
        )
      }
      await refreshInspections()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to update issues. Try again.",
      )
    } finally {
      setSavingIssues(false)
    }
  }

  const statusTrackingInspections = selectedDate ? todaysInspections : inspections

  const refreshAll = async () => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    setError(null)
    setLoading(true)
    try {
      const [insRes, roomRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/inspections`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ])
      const insJson = insRes.ok ? await insRes.json().catch(() => ({})) : {}
      const roomJson = roomRes.ok ? await roomRes.json().catch(() => ({})) : {}
      const list = (insJson as any).inspections || []
      setInspections(
        list.map((i: any) => ({
          id: String(i.id),
          roomNumber: String(i.roomNumber),
          floor: i.floor !== null && i.floor !== undefined ? Number(i.floor) : null,
          roomType: i.roomType ?? null,
          inspector: i.inspector || "—",
          scheduledDate: i.scheduledDate || "",
          shift: (i.shift as ShiftOption) || "All day",
          status: (i.status as InspectionStatus) || "Pending",
          checklist: (i.checklist as InspectionChecklist) || undefined,
          issuesSummary: i.issuesSummary ?? null,
          issuesCount: Number(i.issuesCount || 0),
          cleanedBy: i.cleanedBy ?? null,
        }))
      )
      const roomList = (roomJson as any).rooms || []
      setRooms(
        roomList.map((r: any) => ({
          roomNumber: String(r.roomNumber),
          floor: r.floor !== null && r.floor !== undefined ? Number(r.floor) : null,
          roomType: r.roomType ?? null,
        }))
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="pb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Room inspection
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule inspections, manage checklists, track issues, and monitor inspector
            performance.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                refreshAll()
              }}
              className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"
            />
          </div>
          <button
            type="button"
            onClick={refreshAll}
            disabled={loading || !user?.hotelId}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-3 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="schedule" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-3">
          <InspectionSchedule
            selectedDate={selectedDate}
            rooms={rooms}
            creating={creating}
            onCreate={handleCreate}
          />
        </TabsContent>

        <TabsContent value="checklist" className="space-y-3">
          <ChecklistManagement
            inspections={inspections}
            activeInspectionId={activeInspectionId}
            onSelectInspection={setActiveInspectionId}
            onUpdateChecklist={handleUpdateChecklist}
            saving={savingChecklist}
          />
        </TabsContent>

        <TabsContent value="status" className="space-y-3">
          <StatusTracking inspections={statusTrackingInspections} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-3">
          <IssueReporting
            inspections={inspections}
            activeInspectionId={activeInspectionId}
            onSelectInspection={setActiveInspectionId}
            onUpdateIssues={handleUpdateIssues}
            saving={savingIssues}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-3">
          <PerformanceMonitoring inspections={inspections} />
        </TabsContent>

        <TabsContent value="history" className="space-y-3">
          <HistoricalAnalytics inspections={inspections} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

