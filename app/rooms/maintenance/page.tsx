"use client"

import { useEffect, useState } from "react"
import { Wrench, AlertCircle, Radio, CheckCircle, Plus } from "lucide-react"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/auth-context"
import { MaintenanceRequestDialog } from "@/components/rooms/maintenance-request-dialog"

type MaintenanceStatus = "Pending" | "In Progress" | "Resolved"

type MaintenancePriority = "Low" | "Medium" | "High"

interface MaintenanceRequest {
  id: string
  roomNumber: string
  issue: string
  priority: MaintenancePriority
  status: MaintenanceStatus
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const getPriorityColor = (priority: MaintenancePriority) => {
  if (priority === "High") return "bg-red-100 text-red-800"
  if (priority === "Medium") return "bg-amber-100 text-amber-800"
  return "bg-green-100 text-green-800"
}

const getStatusColor = (status: MaintenanceStatus) => {
  if (status === "Resolved") return "bg-green-100 text-green-800"
  if (status === "In Progress") return "bg-sky-100 text-sky-800"
  return "bg-gray-100 text-gray-800"
}

export default function MaintenancePage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignOpen, setAssignOpen] = useState(false)

  useEffect(() => {
    const loadRequests = async () => {
      if (!user?.hotelId) {
        setError("Hotel information not available. Please sign in again.")
        setLoading(false)
        return
      }
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/maintenance-requests`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        })
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          let message = "Failed to load maintenance requests"
          try {
            const data = text ? JSON.parse(text) : {}
            message = data?.message || message
          } catch {}
          throw new Error(`${message} (HTTP ${res.status})`)
        }
        const data = await res.json().catch(() => ({}))
        setRequests(data.requests || [])
        setError(null)
      } catch (err: any) {
        console.error("Error loading maintenance requests", err)
        setError(err.message || "Failed to load maintenance requests")
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [user?.hotelId])

  const refetch = () => {
    if (!user?.hotelId) return
    setLoading(true)
    setError(null)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/maintenance-requests`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          let message = "Failed to load maintenance requests"
          try {
            const data = text ? JSON.parse(text) : {}
            message = data?.message || message
          } catch {}
          throw new Error(`${message} (HTTP ${res.status})`)
        }
        return res.json().catch(() => ({}))
      })
      .then((data) => setRequests(data.requests || []))
      .catch((err: any) => setError(err?.message || "Failed to load maintenance requests"))
      .finally(() => setLoading(false))
  }

  const pending = requests.filter((r) => r.status === "Pending").length
  const inProgress = requests.filter((r) => r.status === "In Progress").length
  const resolved = requests.filter((r) => r.status === "Resolved").length

  return (
    <main className="p-4 space-y-6">
      <RoomSectionHeader
        icon={Wrench}
        title="Maintenance Requirements"
        description="The system fetches real-time data from the backend for all modules, including Room Status, Floor Management, Housekeeping Assignments, and Maintenance Requests. All records are loaded dynamically from the database and displayed on their respective pages. Any updates made in one module are immediately reflected across related sections, ensuring accurate status tracking, smooth operations, and centralized hotel management."
        action={
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setAssignOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Assign maintenance
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total requests</p>
              <p className="text-xl font-bold text-gray-900">{requests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending / In Progress</p>
              <p className="text-xl font-bold text-amber-600">{pending + inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Resolved</p>
              <p className="text-xl font-bold text-green-600">{resolved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <CardTitle className="text-sm font-semibold">Maintenance requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-gray-500 py-4">Loading maintenance requests...</p>
            ) : error ? (
              <p className="text-sm text-red-600 py-4">{error}</p>
            ) : requests.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No maintenance requests found.</p>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100/60 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm">Room {req.roomNumber}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{req.issue}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge className={getPriorityColor(req.priority)}>{req.priority}</Badge>
                    <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Each request is tracked from <span className="font-medium">Pending</span> to{" "}
            <span className="font-medium">In Progress</span> and finally{" "}
            <span className="font-medium">Resolved</span>, helping keep rooms safe, comfortable, and ready for guests.
          </p>
        </CardContent>
      </Card>

      {user?.hotelId && (
        <MaintenanceRequestDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          hotelId={user.hotelId}
          onSuccess={refetch}
        />
      )}
    </main>
  )
}
