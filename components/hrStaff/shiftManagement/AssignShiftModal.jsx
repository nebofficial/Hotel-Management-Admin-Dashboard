'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AssignShiftModal({ open, onOpenChange, shift, staff = [], onSubmit }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedIds, setSelectedIds] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().slice(0, 10))
      setSelectedIds([])
    }
  }, [open])

  const toggleStaff = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectAll = () => {
    if (selectedIds.length === staff.length) setSelectedIds([])
    else setSelectedIds(staff.map((s) => s.id))
  }

  const handleSave = async () => {
    if (!shift?.id || !selectedIds.length || !date) return
    setSaving(true)
    try {
      await onSubmit?.({ staffIds: selectedIds, shiftId: shift.id, date })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-violet-50 to-purple-50 max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Assign Shift: {shift?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-xs flex-1 overflow-auto">
          <div className="space-y-1">
            <Label className="text-[11px]">Date</Label>
            <Input type="date" className="h-8 text-xs" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px]">Select Staff</Label>
              <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px]" onClick={selectAll}>
                {selectedIds.length === staff.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-1">
              {staff.length === 0 ? (
                <p className="text-slate-500 py-2">No staff available</p>
              ) : (
                staff.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-1 py-0.5">
                    <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleStaff(s.id)} />
                    <span>{s.name}</span>
                    {s.department && <span className="text-slate-400">({s.department})</span>}
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button type="button" size="sm" className="h-8 text-xs" disabled={saving || !selectedIds.length} onClick={handleSave}>
              {saving ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
