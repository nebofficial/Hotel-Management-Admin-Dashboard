'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusColor = (day) => {
  if (day.present > 0 && day.absent === 0) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (day.absent > 0 && day.present === 0) return 'bg-rose-100 text-rose-700 border-rose-200'
  if (day.late > 0 || day.earlyExit > 0) return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

export function AttendanceCalendar({ monthLabel, days, onSelectDate }) {
  const list = days || []

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-amber-900">
          Attendance Calendar {monthLabel ? `– ${monthLabel}` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        {list.length === 0 ? (
          <p className="text-xs text-amber-700/80">
            No attendance data for this month yet. Mark attendance to see a calendar heatmap.
          </p>
        ) : (
          <div className="grid grid-cols-7 gap-1 text-[10px]">
            {list.map((d) => (
              <button
                key={d.date}
                type="button"
                className={`flex flex-col items-center justify-center rounded-md border px-1 py-1 ${statusColor(d)} hover:brightness-105`}
                onClick={() => onSelectDate?.(d.date)}
              >
                <span className="font-semibold">
                  {d.date.slice(-2)}
                </span>
                <span className="opacity-80">
                  P{d.present}/A{d.absent}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

