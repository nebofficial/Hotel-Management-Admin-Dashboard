"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Layers, ChevronRight, Plus } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { RoomFormDialog } from "@/components/rooms/room-form-dialog"
import { FloorCard } from "@/components/rooms/floor-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface FloorSummary {
  id: number
  floor: string
  floorNumber: number
  totalRooms: number
  occupied: number
  available: number
  maintenance: number
  cleaning: number
}

interface RoomRow {
  id: string
  roomNumber: string
  roomType: string
  floor: number
  status: string
  capacity?: number
  pricePerNight?: number
}

export default function FloorsPageContent() {
  const searchParams = useSearchParams()
  const selectedFloor = searchParams.get("floor")
  const { user } = useAuth()
  const [floors, setFloors] = useState<FloorSummary[]>([])
  const [floorRooms, setFloorRooms] = useState<RoomRow[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const defaultFloor = selectedFloor != null ? parseInt(selectedFloor, 10) : undefined
  const validDefaultFloor = defaultFloor != null && !Number.isNaN(defaultFloor) ? defaultFloor : undefined

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/floors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { floors: [] }))
      .then((data) => setFloors(data.floors || []))
      .catch(() => setFloors([]))
      .finally(() => setLoading(false))
  }, [user?.hotelId])

  useEffect(() => {
    if (!user?.hotelId || selectedFloor == null) {
      setFloorRooms([])
      return
    }
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/floors/${selectedFloor}/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { rooms: [] }))
      .then((data) => setFloorRooms(data.rooms || []))
      .catch(() => setFloorRooms([]))
  }, [user?.hotelId, selectedFloor])

  const floorNum = selectedFloor != null ? parseInt(selectedFloor, 10) : null
  const currentFloorLabel = floors.find((f) => f.floorNumber === floorNum)?.floor ?? `Floor ${floorNum}`

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "occupied") return "bg-red-100 text-red-800"
    if (s === "available") return "bg-green-100 text-green-800"
    if (s === "maintenance") return "bg-amber-100 text-amber-800"
    return "bg-gray-100 text-gray-800"
  }

  const refetchFloors = () => {
    if (!user?.hotelId) return
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/floors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { floors: [] }))
      .then((data) => setFloors(data.floors || []))
      .catch(() => {})
    if (selectedFloor != null) {
      fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/floors/${selectedFloor}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : { rooms: [] }))
        .then((data) => setFloorRooms(data.rooms || []))
        .catch(() => setFloorRooms([]))
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    refetchFloors()
  }

  return (
    <main className="p-4 space-y-6">
      <RoomSectionHeader
        icon={Layers}
        title="Floor Management"
        description="The system fetches real-time data from the backend for all modules, including Room Status, Floor Management, Housekeeping Assignments, and Maintenance Requests. All records are loaded dynamically from the database and displayed on their respective pages. Any updates made in one module are immediately reflected across related sections, ensuring accurate status tracking, smooth operations, and centralized hotel management."
        action={
          <Button size="sm" onClick={() => setFormOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add room
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
          ))
        ) : (
          floors.map((f) => (
            <FloorCard
              key={f.id}
              id={f.id}
              floor={f.floor}
              floorNumber={f.floorNumber}
              totalRooms={f.totalRooms}
              occupied={f.occupied}
              available={f.available}
              maintenance={f.maintenance}
              cleaning={f.cleaning}
            />
          ))
        )}
      </div>

      {floorNum != null && !Number.isNaN(floorNum) && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold">{currentFloorLabel} — Rooms</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={() => setFormOpen(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add room on this floor
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            {floorRooms.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No rooms on this floor.</p>
            ) : (
              <div className="space-y-2">
                {floorRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Room {room.roomNumber}</p>
                        <p className="text-xs text-gray-500 capitalize">{room.roomType}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(room.status)}>
                      {room.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {user?.hotelId && (
        <RoomFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          defaultFloor={validDefaultFloor}
          onSuccess={handleFormSuccess}
          hotelId={user.hotelId}
        />
      )}
    </main>
  )
}
