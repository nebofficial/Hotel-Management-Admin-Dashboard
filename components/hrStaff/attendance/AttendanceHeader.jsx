'use client'

import { Button } from '@/components/ui/button'
import { CalendarDays, UserCheck } from 'lucide-react'

export function AttendanceHeader({ onMarkToday }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Staff Attendance</h2>
        <p className="text-xs text-slate-600 mt-1">
          Monitor daily check-ins, absences, and generate attendance reports.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs"
          onClick={onMarkToday}
        >
          <CalendarDays className="w-4 h-4" />
          Today
        </Button>
        <Button type="button" size="sm" className="gap-1.5 text-xs" onClick={onMarkToday}>
          <UserCheck className="w-4 h-4" />
          Mark Attendance
        </Button>
      </div>
    </div>
  )
}

