'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function getShiftColor(assignment) {
  const shift = assignment?.shift || {}
  if (shift.isNightShift) return 'bg-rose-100 border-rose-300 text-rose-800'
  if (shift.shiftType === 'Evening') return 'bg-amber-100 border-amber-300 text-amber-800'
  return 'bg-emerald-100 border-emerald-300 text-emerald-800'
}

export function ShiftCalendarView({ schedule, loading }) {
  const days = schedule?.days || []
  const shifts = schedule?.shifts || []

  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-100 to-yellow-100">
        <CardTitle className="text-sm font-semibold text-slate-900">Weekly Shift Schedule</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading...</div>
        ) : days.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">No schedule data. Assign shifts to staff to see the calendar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-amber-200">
                  <th className="py-2 px-2 text-left font-medium text-slate-700">Date</th>
                  <th className="py-2 px-2 text-left font-medium text-slate-700">Assignments</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.date} className="border-b border-amber-100">
                    <td className="py-2 px-2 font-medium text-slate-800 whitespace-nowrap">
                      {new Date(d.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {(d.assignments || []).map((a) => (
                          <span key={a.id} className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium ${getShiftColor(a)}`}>
                            {a.staffName} - {a.shiftName}
                          </span>
                        ))}
                        {(d.assignments || []).length === 0 && <span className="text-slate-400">No assignments</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
