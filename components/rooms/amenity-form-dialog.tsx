"use client"

import { useEffect, useMemo, useState } from "react"
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

type AmenityCategory = "room" | "hotel"

interface FormValues {
  name: string
  category: AmenityCategory
  available: boolean
  roomNumber: string
  floor: string
  description: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotelId: string
  onSuccess: () => void
}

export function AmenityFormDialog({ open, onOpenChange, hotelId, onSuccess }: Props) {
  const defaults = useMemo<FormValues>(
    () => ({
      name: "",
      category: "room",
      available: true,
      roomNumber: "",
      floor: "",
      description: "",
    }),
    []
  )

  const [form, setForm] = useState<FormValues>(defaults)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(defaults)
      setSaving(false)
      setError(null)
    }
  }, [open, defaults])

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/api/hotel-data/${hotelId}/amenities`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          available: form.available,
          roomNumber: form.roomNumber || null,
          floor: form.floor ? Number(form.floor) : null,
          description: form.description || null,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        let message = "Failed to create amenity"
        try {
          const data = text ? JSON.parse(text) : {}
          message = data?.message || message
          if (Array.isArray(data?.errors) && data.errors.length) {
            const detail = data.errors
              .map((e: any) => e?.msg || e?.message || e?.param)
              .filter(Boolean)
              .join(", ")
            if (detail) message = `${message}: ${detail}`
          }
        } catch {}
        throw new Error(`${message} (HTTP ${res.status})`)
      }

      onOpenChange(false)
      onSuccess()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create amenity")
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = form.name.trim().length > 0 && !saving

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Add amenity</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amenity-name">Amenity name</Label>
            <Input
              id="amenity-name"
              placeholder="e.g. Wi‑Fi, AC, TV, Parking, Breakfast"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v: AmenityCategory) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room">Room amenity</SelectItem>
                  <SelectItem value="hotel">Hotel / property amenity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={form.available ? "available" : "unavailable"}
                onValueChange={(v) => setForm((p) => ({ ...p, available: v === "available" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amenity-room">Room number</Label>
              <Input
                id="amenity-room"
                placeholder="Optional · e.g. 101"
                value={form.roomNumber}
                onChange={(e) => setForm((p) => ({ ...p, roomNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenity-floor">Floor</Label>
              <Input
                id="amenity-floor"
                placeholder="Optional · e.g. 1"
                value={form.floor}
                onChange={(e) => setForm((p) => ({ ...p, floor: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenity-description">Description (optional)</Label>
            <Textarea
              id="amenity-description"
              placeholder="Short description that will be shown to users…"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!canSubmit}>
              {saving ? "Saving..." : "Save / Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

