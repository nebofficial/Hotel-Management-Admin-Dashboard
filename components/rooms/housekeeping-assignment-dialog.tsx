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

type AssignmentStatus = "Pending" | "In Progress" | "Completed"

export interface HousekeepingAssignmentFormValues {
  roomNumber: string
  housekeeper: string
  cleaningType: string
  schedule: string
  status: AssignmentStatus
  notes: string
}

const DEFAULT_CLEANING_TYPES = ["Daily refresh", "Checkout cleaning", "Deep cleaning"] as const
const DEFAULT_STATUSES: AssignmentStatus[] = ["Pending", "In Progress", "Completed"]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface HousekeepingAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotelId: string
  onSuccess: () => void
  /** Staff from Staff Assignment module; when provided, housekeeper is a dropdown instead of free text */
  staffList?: { id: string; name: string }[]
}

export function HousekeepingAssignmentDialog({
  open,
  onOpenChange,
  hotelId,
  onSuccess,
  staffList = [],
}: HousekeepingAssignmentDialogProps) {
  const defaultValues = useMemo<HousekeepingAssignmentFormValues>(
    () => ({
      roomNumber: "",
      housekeeper: "",
      cleaningType: DEFAULT_CLEANING_TYPES[0],
      schedule: "",
      status: "Pending",
      notes: "",
    }),
    []
  )

  const [form, setForm] = useState<HousekeepingAssignmentFormValues>(defaultValues)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(defaultValues)
      setSaving(false)
      setError(null)
    }
  }, [open, defaultValues])

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/api/hotel-data/${hotelId}/housekeeping-assignments`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber: form.roomNumber,
          housekeeper: form.housekeeper,
          cleaningType: form.cleaningType,
          schedule: form.schedule || null,
          status: form.status,
          notes: form.notes || null,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        let message = "Failed to create housekeeping assignment"
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
      setError(e?.message || "Failed to create housekeeping assignment")
    } finally {
      setSaving(false)
    }
  }

  const canSubmit =
    form.roomNumber.trim().length > 0 &&
    form.housekeeper.trim().length > 0 &&
    form.cleaningType.trim().length > 0 &&
    !saving

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Assign housekeeping</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room number</Label>
              <Input
                id="roomNumber"
                placeholder="e.g. 101"
                value={form.roomNumber}
                onChange={(e) => setForm((p) => ({ ...p, roomNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="housekeeper">Housekeeper</Label>
              {staffList.length > 0 ? (
                <Select
                  value={form.housekeeper}
                  onValueChange={(v) => setForm((p) => ({ ...p, housekeeper: v }))}
                >
                  <SelectTrigger id="housekeeper">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="housekeeper"
                  placeholder="e.g. Maria Garcia"
                  value={form.housekeeper}
                  onChange={(e) => setForm((p) => ({ ...p, housekeeper: e.target.value }))}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cleaning type</Label>
              <Select
                value={form.cleaningType}
                onValueChange={(v) => setForm((p) => ({ ...p, cleaningType: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cleaning type" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_CLEANING_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: AssignmentStatus) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              placeholder="e.g. Today · 11:00–12:00"
              value={form.schedule}
              onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.value }))}
            />
            <p className="text-xs text-gray-500">Tip: you can type any schedule format your team uses.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Optional details…"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
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
              {saving ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

