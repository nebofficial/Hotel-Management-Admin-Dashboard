'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusColor = (status) => {
  if (status === 'Present') return 'bg-emerald-100 text-emerald-700'
  if (status === 'On Leave') return 'bg-amber-100 text-amber-700'
  if (status === 'Absent') return 'bg-rose-100 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

export function DutyStatusToday({ list }) {
  return (
    <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-sky-800">Duty Status Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-72 overflow-auto pr-1 text-xs">
        {(!list || list.length === 0) && (
          <p className="text-sky-600/80">No schedules found for today.</p>
        )}
        {list?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-sky-100/70 pb-1 last:border-0"
          >
            <div>
              <div className="font-semibold text-slate-800">{item.staffName}</div>
              <div className="text-[11px] text-slate-600">
                {item.department || item.role} • {item.shift} shift
              </div>
            </div>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(
              item.status,
            )}`}>
              {item.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

