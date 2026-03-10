'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AttendanceRow } from './AttendanceRow'

export function AttendanceTable({ records, loading }) {
  return (
    <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-900">Daily Attendance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading attendance…</div>
        ) : !records?.length ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No attendance records for this date. Use “Mark Attendance” to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-500">
                  <th className="py-2 px-2 text-left font-medium">Staff</th>
                  <th className="py-2 px-2 text-left font-medium hidden md:table-cell">Department</th>
                  <th className="py-2 px-2 text-left font-medium hidden sm:table-cell">Shift</th>
                  <th className="py-2 px-2 text-left font-medium">Check-in</th>
                  <th className="py-2 px-2 text-left font-medium">Check-out</th>
                  <th className="py-2 px-2 text-right font-medium">Hours</th>
                  <th className="py-2 px-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <AttendanceRow key={r.id} record={r} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

