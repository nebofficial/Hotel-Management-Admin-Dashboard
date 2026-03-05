"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export interface RoomFormValues {
  roomNumber: string
  roomType: string
  floor: number | ""
  pricePerNight: string
  capacity: number
  status: string
  description: string
}

const defaultValues: RoomFormValues = {
  roomNumber: "",
  roomType: "",
  floor: "",
  pricePerNight: "",
  capacity: 2,
  status: "available",
  description: "",
}

const STATUSES = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
  { value: "cleaning", label: "Cleaning" },
]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface RoomSummary {
  id: string
  roomNumber: string
  roomType: string
  floor: number | ""
  pricePerNight: number
  capacity?: number
  status?: string
  description?: string | null
}

interface RoomFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room?: RoomSummary | null
  onSuccess: () => void
  hotelId: string
}

export function RoomFormDialog({
  open,
  onOpenChange,
  room,
  onSuccess,
  hotelId,
}: RoomFormDialogProps) {
  const [form, setForm] = useState<RoomFormValues>(defaultValues)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomTypeOptions, setRoomTypeOptions] = useState<
    { value: string; label: string }[]
  >([])

  const isEdit = !!room

  useEffect(() => {
    if (open && hotelId) {
      const token = localStorage.getItem("token")
      fetch(`${API_BASE}/api/hotel-data/${hotelId}/room-type-definitions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : { definitions: [] }))
        .then((data) => {
          const defs = data.definitions || []
          setRoomTypeOptions(
            defs.map((d: { name: string }) => ({
              value: d.name,
              label: d.name,
            }))
          )
        })
        .catch(() => setRoomTypeOptions([]))
    }
  }, [open, hotelId])

  useEffect(() => {
    if (open) {
      setError(null)
      if (room) {
        setForm({
          roomNumber: room.roomNumber ?? "",
          roomType: room.roomType ?? "",
          floor: room.floor ?? "",
          pricePerNight: String(room.pricePerNight ?? ""),
          capacity: room.capacity ?? 2,
          status: room.status ?? "available",
          description: room.description ?? "",
        })
      } else {
        setForm(defaultValues)
      }
    }
  }, [open, room])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")

      const body = {
        ...form,
        floor: Number(form.floor),
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
      }

      const url = isEdit
        ? `${API_BASE}/api/hotel-data/${hotelId}/rooms/${room.id}`
        : `${API_BASE}/api/hotel-data/${hotelId}/rooms`

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to save room")

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl rounded-2xl ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-700">
            {isEdit ? "✏ Edit Room" : "🏨 Add New Room"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Room Number + Floor */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-indigo-600">Room Number</Label>
              <Input
                value={form.roomNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, roomNumber: e.target.value }))
                }
                className="mt-1 border-indigo-300 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <Label className="text-indigo-600">Floor</Label>
              <Input
                type="number"
                min={0}
                value={form.floor}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    floor: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                className="mt-1 border-indigo-300"
              />
            </div>
          </div>

          {/* Room Type + Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-purple-600">Room Type</Label>
              <Select
                value={form.roomType}// add signle ,double,deluxe,suite,standard,superior,
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, roomType: v }))
                }
              >
                <SelectTrigger className="mt-1 border-purple-300">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-green-600">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v }))
                }
              >
                <SelectTrigger className="mt-1 border-green-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price + Capacity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-pink-600">Price per Night</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.pricePerNight}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pricePerNight: e.target.value }))
                }
                className="mt-1 border-pink-300"
              />
            </div>

            <div>
              <Label className="text-yellow-600">Capacity</Label>
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    capacity: Number(e.target.value) || 1,
                  }))
                }
                className="mt-1 border-yellow-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-gray-600">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="mt-1 border-gray-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-400"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
            >
              {saving ? "Saving..." : isEdit ? "Update Room" : "Add Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
