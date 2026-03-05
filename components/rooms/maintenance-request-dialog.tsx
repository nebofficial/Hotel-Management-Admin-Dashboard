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

type MaintenanceStatus = "Pending" | "In Progress" | "Resolved"
type MaintenancePriority = "Low" | "Medium" | "High"

interface FormValues {
  roomNumber: string
  issue: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  notes: string
}

const PRIORITIES: MaintenancePriority[] = ["Low", "Medium", "High"]
const STATUSES: MaintenanceStatus[] = ["Pending", "In Progress", "Resolved"]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotelId: string
  onSuccess: () => void
}

export function MaintenanceRequestDialog({ open, onOpenChange, hotelId, onSuccess }: Props) {
  const defaultValues = useMemo<FormValues>(
    () => ({
      roomNumber: "",
      issue: "",
      priority: "Medium",
      status: "Pending",
      notes: "",
    }),
    []
  )

  const [form, setForm] = useState<FormValues>(defaultValues)
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
      const res = await fetch(`${API_BASE}/api/hotel-data/${hotelId}/maintenance-requests`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber: form.roomNumber,
          issue: form.issue,
          priority: form.priority,
          status: form.status,
          notes: form.notes || null,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        let message = "Failed to create maintenance request"
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
      setError(e?.message || "Failed to create maintenance request")
    } finally {
      setSaving(false)
    }
  }

  const canSubmit =
    form.roomNumber.trim().length > 0 &&
    form.issue.trim().length > 0 &&
    !saving

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Assign maintenance</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room number</Label>
              <Input
                id="roomNumber"
                placeholder="e.g. 105"
                value={form.roomNumber}
                onChange={(e) => setForm((p) => ({ ...p, roomNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v: MaintenancePriority) => setForm((p) => ({ ...p, priority: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue">Issue</Label>
            <Textarea
              id="issue"
              placeholder="Describe the maintenance issue..."
              value={form.issue}
              onChange={(e) => setForm((p) => ({ ...p, issue: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v: MaintenanceStatus) => setForm((p) => ({ ...p, status: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional details…"
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
              {saving ? "Saving..." : "Assign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

