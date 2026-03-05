"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutGrid, MoreVertical, List, PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { RoomFormDialog } from "@/components/rooms/room-form-dialog"
import { RoomTypeCard } from "@/components/rooms/room-type-card"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface RoomTypeDefinition {
  id: string
  name: string
  description: string | null
  defaultCapacity?: number
  defaultPricePerNight?: number
  roomCount?: number
}

export default function RoomTypesPage() {
  const { user } = useAuth()
  const [definitions, setDefinitions] = useState<RoomTypeDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [roomFormOpen, setRoomFormOpen] = useState(false)
  const [defaultRoomTypeName, setDefaultRoomTypeName] = useState<string | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<RoomTypeDefinition | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchDefinitions = () => {
    if (!user?.hotelId) return
    setLoading(true)
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/room-type-definitions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { definitions: [] }))
      .then((data) => {
        const raw = data.definitions || []
        setDefinitions(
          raw.map((d: Record<string, unknown>) => ({
            id: d.id,
            name: d.name ?? "",
            description: d.description ?? null,
            defaultCapacity: d.defaultCapacity ?? d.default_capacity ?? 2,
            defaultPricePerNight: d.defaultPricePerNight ?? d.default_price_per_night,
            roomCount: d.roomCount ?? d.room_count ?? 0,
          }))
        )
      })
      .catch(() => setDefinitions([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetchDefinitions()
  }, [user?.hotelId])

  const handleAddRoom = (typeName: string) => {
    setDefaultRoomTypeName(typeName)
    setRoomFormOpen(true)
  }

  const handleRoomFormSuccess = () => {
    setRoomFormOpen(false)
    setDefaultRoomTypeName(undefined)
    fetchDefinitions()
  }

  const handleDelete = (def: RoomTypeDefinition) => {
    setDeleteTarget(def)
  }

  const confirmDelete = async () => {
    if (!deleteTarget || !user?.hotelId) return
    setDeleting(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/room-type-definitions/${deleteTarget.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) {
        setDeleteTarget(null)
        fetchDefinitions()
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <main className="p-4 space-y-4">
      <RoomSectionHeader
        icon={LayoutGrid}
        title="Room Types"
        description="View and manage room types. Each type is clearly presented with guest capacity and room features for consistent classification."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : definitions.length === 0 ? (
        <Card className="border border-dashed border-gray-200">
          <CardContent className="py-12 text-center text-sm text-gray-500">
            No room types loaded. Refresh the page to load default room types.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {definitions.map((def) => (
            <div key={def.id} className="relative group">
              <RoomTypeCard
                id={def.id}
                name={def.name}
                description={def.description}
                defaultCapacity={def.defaultCapacity}
                roomCount={def.roomCount ?? 0}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/rooms/list">
                        <List className="h-4 w-4" />
                        View rooms
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddRoom(def.name)}>
                      <PlusCircle className="h-4 w-4" />
                      Add room of this type
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/rooms/types/${def.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        Update
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(def)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {user?.hotelId && (
        <RoomFormDialog
          open={roomFormOpen}
          onOpenChange={(open) => {
            setRoomFormOpen(open)
            if (!open) setDefaultRoomTypeName(undefined)
          }}
          defaultRoomType={defaultRoomTypeName}
          onSuccess={handleRoomFormSuccess}
          hotelId={user.hotelId}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete room type?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.roomCount
                ? `"${deleteTarget.name}" has ${deleteTarget.roomCount} room(s). Deleting the type will not remove those rooms.`
                : `Remove "${deleteTarget?.name}"? You can add it again later.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
