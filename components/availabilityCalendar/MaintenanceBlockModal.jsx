'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const REASONS = [
  { value: 'plumbing', label: 'Plumbing Issue' },
  { value: 'electrical', label: 'Electrical Work' },
  { value: 'deep_cleaning', label: 'Deep Cleaning' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'other', label: 'Other' },
]

export default function MaintenanceBlockModal({ open, onOpenChange, room, onSave }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('plumbing')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  const handleSave = async () => {
    if (!room || !startDate || !endDate) return
    setSaving(true)
    try {
      await onSave?.({
        roomId: room.id,
        startDate,
        endDate,
        reason: note || REASONS.find((r) => r.value === reason)?.label || '',
        type: reason,
      })
      setStartDate('')
      setEndDate('')
      setReason('plumbing')
      setNote('')
      onOpenChange(false)
    } catch (e) {
      alert(e.message || 'Failed to block room for maintenance')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Maintenance Block</DialogTitle>
          <DialogDescription>
            Block Room {room?.roomNumber} ({room?.roomType}) for maintenance. Room will be hidden from bookings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Date</Label>
              <Input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Maintenance Type</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reason / Notes (Optional)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Short description of maintenance"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !startDate || !endDate}>
            {saving ? 'Saving...' : 'Save Block'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

