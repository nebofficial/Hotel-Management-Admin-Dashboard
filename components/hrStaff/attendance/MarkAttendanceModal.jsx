'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { markAttendance } from '@/services/api/attendanceApi'
import { fetchStaffMembers } from '@/services/api/staffApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export function MarkAttendanceModal({ open, onOpenChange, hotelId, date, onMarked }) {
  const [staffOptions, setStaffOptions] = useState([])
  const [staffId, setStaffId] = useState('')
  const [status, setStatus] = useState('Present')
  const [shift, setShift] = useState('Morning')
  const [checkInTime, setCheckInTime] = useState('')
  const [checkOutTime, setCheckOutTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const apiBase = hotelId ? `${getApiBaseUrl()}/api/hotel-data/${hotelId}` : ''

  useEffect(() => {
    if (!apiBase || !open) return
    const load = async () => {
      try {
        const res = await fetchStaffMembers(apiBase)
        setStaffOptions(res.staff || [])
      } catch {
        setStaffOptions([])
      }
    }
    load()
  }, [apiBase, open])

  const handleSubmit = async () => {
    if (!apiBase || !staffId || !date) return
    const selected = staffOptions.find((s) => s.id === staffId)
    if (!selected) return
    setSubmitting(true)
    try {
      await markAttendance(apiBase, {
        staffId: selected.id,
        staffName: selected.name,
        department: selected.department,
        date,
        shift,
        status,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
      })
      onMarked?.()
      onOpenChange(false)
    } catch {
      // error toast could be added later
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Mark Attendance</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px]">Date</Label>
            <Input className="h-8 text-xs" type="date" value={date} readOnly />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Staff</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                {staffOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} {s.department ? `(${s.department})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Shift</Label>
              <Select value={shift} onValueChange={setShift}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Early Exit">Early Exit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Check-in Time</Label>
              <Input
                className="h-8 text-xs"
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Check-out Time</Label>
              <Input
                className="h-8 text-xs"
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="button" size="sm" className="h-8 text-xs" disabled={submitting || !staffId} onClick={handleSubmit}>
              {submitting ? 'Saving…' : 'Save Attendance'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

