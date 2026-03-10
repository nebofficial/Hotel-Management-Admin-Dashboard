'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function buildCalendarData(rules = []) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() // 0-based

  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  const days = []
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10)
    const activeRules = rules.filter((r) => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      return d >= start && d <= end
    })
    days.push({
      date: new Date(d),
      label: d.getDate(),
      hasRules: activeRules.length > 0,
      isHoliday: activeRules.some((r) => r.ruleType === 'holiday'),
      isWeekend: [0, 5, 6].includes(d.getDay()),
    })
  }

  const startWeekday = first.getDay() // 0-6
  const leadingBlanks = Array.from({ length: startWeekday }, () => null)

  return {
    monthLabel: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
    cells: [...leadingBlanks, ...days],
  }
}

export function SeasonalCalendarView({ rules = [] }) {
  const { monthLabel, cells } = buildCalendarData(rules)

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200/80 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10">
        <CardTitle className="text-sm font-semibold text-slate-800">
          Seasonal Pricing Calendar
        </CardTitle>
        <p className="text-[11px] text-slate-600">
          Visual overview of days impacted by seasonal and holiday pricing rules this month.
        </p>
      </CardHeader>
      <CardContent className="p-4 text-xs">
        <p className="text-[11px] font-semibold text-slate-700 mb-2">{monthLabel}</p>
        <div className="grid grid-cols-7 gap-1 text-[11px] text-center mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="font-medium text-slate-500">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-[11px]">
          {cells.map((cell, idx) =>
            cell === null ? (
              <div key={idx} />
            ) : (
              <div
                key={cell.date.toISOString()}
                className={`h-8 flex items-center justify-center rounded-md border text-[11px] ${
                  cell.hasRules
                    ? cell.isHoliday
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {cell.label}
              </div>
            ),
          )}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-emerald-200 border border-emerald-400" />
            <span>Seasonal rule days</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-amber-200 border border-amber-400" />
            <span>Holiday pricing days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

