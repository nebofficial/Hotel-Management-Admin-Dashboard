"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, RefreshCw, CalendarDays } from "lucide-react"
import { LaundrySchedule, LaundryScheduleTask, LaundryCycleType } from "./LaundrySchedule"
import { TaskAssignment, TaskAssignmentRecord, AssignmentType } from "./TaskAssignment"
import {
  ProcessTracking,
  ProcessTrackingTask,
  LaundryStatus,
} from "./ProcessTracking"
import { InventoryLink, InventoryLinkTask } from "./InventoryLink"
import { ReportingAnalytics, ReportingTask } from "./ReportingAnalytics"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface LaundryTaskRecord {
  id: string
  loadNumber: string
  itemType: string
  quantity: number
  scheduledDate: string
  assignedTo: string | null
  assignedType: AssignmentType
  status: LaundryStatus
  cycleType: LaundryCycleType
  notes: string | null
  completedAt: string | null
}

export default function LaundryManagement() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<LaundryTaskRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(
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
        const res = await fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/laundry-tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(
            (data as any)?.message || `Failed to load laundry tasks (${res.status})`,
          )
        }
        const data = await res.json().catch(() => ({}))
        const list = (data as any).tasks || []
        const mapped: LaundryTaskRecord[] = list.map((t: any) => ({
          id: String(t.id),
          loadNumber: String(t.loadNumber),
          itemType: String(t.itemType),
          quantity: Number(t.quantity || 0),
          scheduledDate: String(t.scheduledDate || ""),
          assignedTo: t.assignedTo ? String(t.assignedTo) : null,
          assignedType: (t.assignedType as AssignmentType) || "Staff",
          status: (t.status as LaundryStatus) || "Pending",
          cycleType: (t.cycleType as LaundryCycleType) || "Daily",
          notes: t.notes ?? null,
          completedAt: t.completedAt ?? null,
        }))
        setTasks(mapped)
      } catch (e: any) {
        console.error(e)
        setError(
          e instanceof Error ? e.message : "Failed to load laundry tasks.",
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user?.hotelId])

  const refreshTasks = async () => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/laundry-tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) return
      const data = await res.json().catch(() => ({}))
      const list = (data as any).tasks || []
      const mapped: LaundryTaskRecord[] = list.map((t: any) => ({
        id: String(t.id),
        loadNumber: String(t.loadNumber),
        itemType: String(t.itemType),
        quantity: Number(t.quantity || 0),
        scheduledDate: String(t.scheduledDate || ""),
        assignedTo: t.assignedTo ? String(t.assignedTo) : null,
        assignedType: (t.assignedType as AssignmentType) || "Staff",
        status: (t.status as LaundryStatus) || "Pending",
        cycleType: (t.cycleType as LaundryCycleType) || "Daily",
        notes: t.notes ?? null,
        completedAt: t.completedAt ?? null,
      }))
      setTasks(mapped)
    } catch {
      // ignore
    }
  }

  const handleCreate = async (payload: {
    loadNumber: string
    itemType: string
    quantity: number
    scheduledDate: string
    cycleType: LaundryCycleType
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
        `${API_BASE}/api/hotel-data/${user.hotelId}/laundry-tasks`,
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
          (data as any)?.message || `Failed to create laundry task (${res.status})`,
        )
      }
      await refreshTasks()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to create laundry task. Try again.",
      )
    } finally {
      setCreating(false)
    }
  }

  const handleAssign = async (
    id: string,
    updates: { assignedTo: string; assignedType: AssignmentType },
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
        `${API_BASE}/api/hotel-data/${user.hotelId}/laundry-tasks/${id}`,
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
          (data as any)?.message || `Failed to assign task (${res.status})`,
        )
      }
      await refreshTasks()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to assign task. Try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: LaundryStatus) => {
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
        `${API_BASE}/api/hotel-data/${user.hotelId}/laundry-tasks/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update status (${res.status})`,
        )
      }
      await refreshTasks()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to update status. Try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  const scheduleTasks: LaundryScheduleTask[] = useMemo(
    () =>
      tasks.map((t) => ({
        id: t.id,
        loadNumber: t.loadNumber,
        itemType: t.itemType,
        quantity: t.quantity,
        scheduledDate: t.scheduledDate,
        cycleType: t.cycleType,
        status: t.status,
      })),
    [tasks],
  )

  const assignmentTasks: TaskAssignmentRecord[] = useMemo(
    () =>
      tasks.map((t) => ({
        id: t.id,
        loadNumber: t.loadNumber,
        itemType: t.itemType,
        quantity: t.quantity,
        scheduledDate: t.scheduledDate,
        assignedTo: t.assignedTo,
        assignedType: t.assignedType,
        status: t.status,
      })),
    [tasks],
  )

  const processTasks: ProcessTrackingTask[] = useMemo(
    () =>
      tasks.map((t) => ({
        id: t.id,
        loadNumber: t.loadNumber,
        itemType: t.itemType,
        quantity: t.quantity,
        status: t.status,
        assignedTo: t.assignedTo,
      })),
    [tasks],
  )

  const inventoryTasks: InventoryLinkTask[] = useMemo(
    () =>
      tasks.map((t) => ({
        id: t.id,
        loadNumber: t.loadNumber,
        itemType: t.itemType,
        quantity: t.quantity,
        status: t.status,
        scheduledDate: t.scheduledDate,
      })),
    [tasks],
  )

  const reportingTasks: ReportingTask[] = useMemo(
    () =>
      tasks.map((t) => ({
        id: t.id,
        loadNumber: t.loadNumber,
        itemType: t.itemType,
        quantity: t.quantity,
        status: t.status,
        scheduledDate: t.scheduledDate,
        completedAt: t.completedAt,
        assignedTo: t.assignedTo,
        assignedType: t.assignedType,
      })),
    [tasks],
  )

  const refreshAll = async () => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/laundry-tasks`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!res.ok) return
      const data = await res.json().catch(() => ({}))
      const list = (data as any).tasks || []
      setTasks(
        list.map((t: any) => ({
          id: String(t.id),
          loadNumber: String(t.loadNumber),
          itemType: String(t.itemType),
          quantity: Number(t.quantity || 0),
          scheduledDate: String(t.scheduledDate || ""),
          assignedTo: t.assignedTo ? String(t.assignedTo) : null,
          assignedType: (t.assignedType as AssignmentType) || "Staff",
          status: (t.status as LaundryStatus) || "Pending",
          cycleType: (t.cycleType as LaundryCycleType) || "Daily",
          notes: t.notes ?? null,
          completedAt: t.completedAt ?? null,
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
          <h1 className="text-lg font-semibold text-slate-900">Laundry management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule loads, assign tasks, track processing stages, and monitor laundry performance.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
          <TabsTrigger value="tracking">Process tracking</TabsTrigger>
          <TabsTrigger value="inventory">Inventory link</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-3">
          <LaundrySchedule
            selectedDate={selectedDate}
            tasks={scheduleTasks}
            creating={creating}
            onCreate={handleCreate}
          />
        </TabsContent>

        <TabsContent value="assignment" className="space-y-3">
          <TaskAssignment
            tasks={assignmentTasks}
            onAssign={handleAssign}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-3">
          <ProcessTracking
            tasks={processTasks}
            onUpdateStatus={handleUpdateStatus}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-3">
          <InventoryLink tasks={inventoryTasks} />
        </TabsContent>

        <TabsContent value="reporting" className="space-y-3">
          <ReportingAnalytics tasks={reportingTasks} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
