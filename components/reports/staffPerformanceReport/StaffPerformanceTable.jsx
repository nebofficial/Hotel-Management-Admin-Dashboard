'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatPercent = (v) =>
  typeof v === 'number' ? `${v.toFixed(1)}%` : v ?? '-'

export function StaffPerformanceTable({ attendance = [], tasks = [], loading }) {
  if (!attendance.length && !tasks.length && !loading) return null

  const merged = (attendance || []).map((a) => {
    const t = (tasks || []).find((x) => x.staffName === a.staffName) || {}
    return {
      staffName: a.staffName,
      department: a.department,
      attendancePercentage: a.attendancePercentage,
      lateArrivals: a.lateArrivals,
      absences: a.absences,
      tasksAssigned: t.tasksAssigned ?? 0,
      tasksCompleted: t.tasksCompleted ?? 0,
      completionRate: t.completionRate ?? 0,
    }
  })

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-800">Detailed Staff Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Staff</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Department</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Attendance</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Late</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Absences</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Tasks</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Completion</th>
              </tr>
            </thead>
            <tbody>
              {merged.slice(0, 80).map((row, i) => (
                <tr key={row.staffName || i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium text-slate-800">{row.staffName}</td>
                  <td className="py-2 px-3 text-slate-600">{row.department || '-'}</td>
                  <td className="py-2 px-3 text-center">{formatPercent(row.attendancePercentage)}</td>
                  <td className="py-2 px-3 text-center">{row.lateArrivals ?? 0}</td>
                  <td className="py-2 px-3 text-center text-red-600">{row.absences ?? 0}</td>
                  <td className="py-2 px-3 text-right">
                    {row.tasksCompleted}/{row.tasksAssigned}
                  </td>
                  <td className="py-2 px-3 text-center text-emerald-700 font-semibold">
                    {formatPercent(row.completionRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

