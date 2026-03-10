'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function CreateShiftModal({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('06:00')
  const [endTime, setEndTime] = useState('14:00')
  const [breakMinutes, setBreakMinutes] = useState(0)
  const [isNightShift, setIsNightShift] = useState(false)
  const [shiftType, setShiftType] = useState('Morning')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name || !startTime || !endTime) return
    setSaving(true)
    try {
      await onSubmit?.({
        name,
        description,
        startTime,
        endTime,
        breakMinutes: parseInt(breakMinutes, 10) || 0,
        isNightShift,
        shiftType,
      })
      setName('')
      setDescription('')
      setStartTime('06:00')
      setEndTime('14:00')
      setBreakMinutes(0)
      setIsNightShift(false)
      setShiftType('Morning')
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-sky-50 to-blue-50">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Create Shift</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px]">Shift Name</Label>
            <Input className="h-8 text-xs" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning Shift" />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Description</Label>
            <Textarea className="text-xs" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px]">Start Time</Label>
              <Input type="time" className="h-8 text-xs" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">End Time</Label>
              <Input type="time" className="h-8 text-xs" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px]">Break (minutes)</Label>
              <Input type="number" min={0} className="h-8 text-xs" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Shift Type</Label>
              <select className="h-8 w-full rounded-md border border-slate-200 text-xs px-2" value={shiftType} onChange={(e) => setShiftType(e.target.value)}>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="night" checked={isNightShift} onChange={(e) => setIsNightShift(e.target.checked)} />
            <Label htmlFor="night" className="text-[11px]">Night shift (allowance applies)</Label>
          </div>
          <div className="flex justify-end pt-1">
            <Button type="button" size="sm" className="h-8 text-xs" disabled={saving || !name} onClick={handleSave}>
              {saving ? 'Saving...' : 'Create Shift'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
