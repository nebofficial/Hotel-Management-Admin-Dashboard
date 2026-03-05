"use client"

import { useEffect, useState } from "react"
import { List, Layers, Plus, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { RoomFormDialog } from "@/components/rooms/room-form-dialog"
import { RoomActionsDropdown } from "@/components/rooms/room-actions-dropdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const floorLabels: Record<number, string> = {
  0: "Ground Floor",
  1: "1st Floor",
  2: "2nd Floor",
  3: "3rd Floor",
}

interface RoomRow {
  id: string
  roomNumber: string
  roomType: string
  floor: number
  status: string
  capacity?: number
  pricePerNight: number
  description?: string | null
  amenities?: string[]
}

export default function RoomListPage() {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<RoomRow | null>(null)
  const [deleteRoom, setDeleteRoom] = useState<RoomRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = () => {
    if (!user?.hotelId) {
      setError("No hotel is associated with the current user, so rooms cannot be loaded.")
      setRooms([])
      setLoading(false)
      return
    }
    const token = localStorage.getItem("token")
    setLoading(true)
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => ({}))
          const msg = data.message || `Failed to load rooms (${r.status})`
          setError(msg)
          return { rooms: [] }
        }
        setError(null)
        return r.json()
      })
      .then((data) => setRooms(data.rooms || []))
      .catch((err) => {
        console.error("Error fetching rooms:", err)
        setError("Unable to contact backend API. Please check that the server is running and reachable.")
        setRooms([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetchRooms()
  }, [user?.hotelId])

  const handleAdd = () => {
    setEditingRoom(null)
    setFormOpen(true)
  }

  const handleEdit = (room: RoomRow) => {
    setEditingRoom(room)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditingRoom(null)
    fetchRooms()
  }

  const handleDeleteClick = (room: RoomRow) => setDeleteRoom(room)
  const handleDeleteConfirm = async () => {
    if (!deleteRoom || !user?.hotelId) return
    setDeleting(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/rooms/${deleteRoom.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) {
        setDeleteRoom(null)
        fetchRooms()
      }
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "occupied") return "bg-red-100 text-red-800"
    if (s === "available") return "bg-green-100 text-green-800"
    if (s === "maintenance") return "bg-amber-100 text-amber-800"
    if (s === "cleaning") return "bg-sky-100 text-sky-800"
    return "bg-gray-100 text-gray-800"
  }

  const parseExtras = (description?: string | null) => {
    const result: { bedType?: string; cleaningStatus?: string; maintenanceStatus?: string } = {}
    if (!description) return result
    const parts = description.split("|").map((p) => p.trim())
    for (const part of parts) {
      if (part.startsWith("{") && part.endsWith("}")) {
        try {
          const data = JSON.parse(part) as Record<string, unknown>
          if (typeof data.bedType === "string") result.bedType = data.bedType
          if (typeof data.cleaningStatus === "string") result.cleaningStatus = data.cleaningStatus
          if (typeof data.maintenanceStatus === "string") result.maintenanceStatus = data.maintenanceStatus
        } catch {
          // ignore parse errors
        }
      }
    }
    return result
  }

  const sortedRooms = [...rooms].sort((a, b) => {
    const fa = a.floor ?? 0
    const fb = b.floor ?? 0
    if (fa !== fb) return fa - fb
    return String(a.roomNumber || "").localeCompare(String(b.roomNumber || ""))
  })

  return (
    <main className="p-4 space-y-4">
      <RoomSectionHeader
        icon={List}
        title="Room List"
        description="All hotel rooms with room number, floor, type, price, capacity, bed type and current room, cleaning, and maintenance status."
        action={
          <Button size="sm" onClick={handleAdd} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add room
          </Button>
        }
      />

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-600" />
            Detailed room table ({rooms.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {error && (
            <p className="mb-3 text-sm text-red-600">
              {error}
            </p>
          )}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : sortedRooms.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No rooms found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Room</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Floor</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Price / night</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Capacity</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Bed type</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Room status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Cleaning status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Maintenance status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Amenities</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRooms.map((room) => {
                    const extras = parseExtras(room.description)
                    const priceText =
                      room.pricePerNight != null ? `₹${Number(room.pricePerNight).toFixed(2)}` : "—"
                    const cap =
                      room.capacity != null
                        ? `${room.capacity} guest${room.capacity === 1 ? "" : "s"}`
                        : "—"
                    const bed = extras.bedType || "—"
                    const cleaning = extras.cleaningStatus || "—"
                    const maintenance = extras.maintenanceStatus || "—"
                    const floorLabel = floorLabels[room.floor] ?? `${room.floor}th Floor`
                    const amenitiesList = room.amenities && Array.isArray(room.amenities) && room.amenities.length > 0
                      ? room.amenities
                      : []
                    return (
                      <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                        <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                          Room {room.roomNumber}
                        </td>
                        <td className="px-3 py-2 text-gray-700">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-900">Floor {room.floor}</span>
                            <span className="text-[11px] text-gray-500">{floorLabel}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-700 capitalize">{room.roomType || "—"}</td>
                        <td className="px-3 py-2 text-gray-700">{priceText}</td>
                        <td className="px-3 py-2 text-gray-700">{cap}</td>
                        <td className="px-3 py-2 text-gray-700">{bed}</td>
                        <td className="px-3 py-2">
                          <Badge className={getStatusColor(room.status)}>{room.status || "—"}</Badge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="capitalize">
                            {cleaning}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="capitalize">
                            {maintenance}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-gray-700">
                          {amenitiesList.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {amenitiesList.slice(0, 3).map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                  {amenity}
                                </Badge>
                              ))}
                              {amenitiesList.length > 3 && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                  +{amenitiesList.length - 3}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <RoomActionsDropdown
                            onEdit={() => handleEdit(room)}
                            onDelete={() => handleDeleteClick(room)}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {user?.hotelId && (
        <RoomFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          room={editingRoom ?? undefined}
          onSuccess={handleFormSuccess}
          hotelId={user.hotelId}
        />
      )}

      <AlertDialog open={!!deleteRoom} onOpenChange={(open) => !open && setDeleteRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete room?</AlertDialogTitle>
            <AlertDialogDescription>
              Room {deleteRoom?.roomNumber} will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
