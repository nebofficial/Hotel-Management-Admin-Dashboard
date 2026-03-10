'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TaskCompletionReport({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-violet-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Task Completion</CardTitle>
        <p className="text-[11px] text-slate-500">Tasks assigned vs completed.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : !data.length ? (
          <p className="text-xs text-slate-500 py-8 text-center">No task data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-violet-100/80 border-b border-violet-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Staff Name</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Tasks Assigned</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Tasks Completed</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 50).map((row, i) => (
                <tr key={row.staffName || i} className="border-b border-slate-100 hover:bg-violet-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{row.staffName}</td>
                  <td className="py-2 px-3 text-right">{row.tasksAssigned ?? 0}</td>
                  <td className="py-2 px-3 text-right">{row.tasksCompleted ?? 0}</td>
                  <td className="py-2 px-3 text-center font-semibold text-violet-600">
                    {row.completionRate?.toFixed(1)}%
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

