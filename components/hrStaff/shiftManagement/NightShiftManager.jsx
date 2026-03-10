'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NightShiftManager({ shifts }) {
  const nightShifts = (shifts || []).filter((s) => s.isNightShift)

  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-gradient-to-br from-rose-50 to-red-50 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-rose-100 to-red-100">
        <CardTitle className="text-sm font-semibold text-slate-900">Night Shifts</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {nightShifts.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500">No night shifts defined</div>
        ) : (
          <div className="space-y-2">
            {nightShifts.map((s) => (
              <div key={s.id} className="p-2 rounded-lg bg-white/80 border border-rose-200 text-[11px]">
                <span className="font-medium">{s.name}</span>
                <span className="ml-2 text-slate-600">{s.startTime} - {s.endTime}</span>
                <span className="ml-2 px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px]">Allowance</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
