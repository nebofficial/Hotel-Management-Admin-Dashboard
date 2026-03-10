'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AttendancePerformanceReport({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-sky-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Attendance Performance</CardTitle>
        <p className="text-[11px] text-slate-500">Reliability by staff member.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : !data.length ? (
          <p className="text-xs text-slate-500 py-8 text-center">No attendance data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-sky-100/80 border-b border-sky-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Staff Name</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Department</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Attendance %</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Late Arrivals</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Absences</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 50).map((row, i) => (
                <tr key={row.staffId || row.staffName || i} className="border-b border-slate-100 hover:bg-sky-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{row.staffName}</td>
                  <td className="py-2 px-3 text-slate-600">{row.department || '-'}</td>
                  <td className="py-2 px-3 text-center font-semibold text-emerald-600">
                    {row.attendancePercentage?.toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-center">{row.lateArrivals ?? 0}</td>
                  <td className="py-2 px-3 text-center text-red-600 font-medium">{row.absences ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

