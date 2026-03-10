'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LateCheckinPanel({ records }) {
  const late = (records || []).filter((r) => r.status === 'Late')

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-orange-900">Late Check-ins</CardTitle>
      </CardHeader>
      <CardContent className="pt-1 space-y-1 text-[11px] text-slate-700">
        {late.length === 0 && <p className="text-orange-700/80">No late arrivals for this date.</p>}
        {late.map((r) => (
          <div key={r.id} className="flex items-center justify-between border-b border-orange-100/70 pb-0.5">
            <div>
              <div className="font-semibold text-slate-900">{r.staffName}</div>
              <div className="text-[10px] text-slate-600">
                {r.department || '—'} • Shift {r.shift}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-orange-800">{r.checkInTime || '—'}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

