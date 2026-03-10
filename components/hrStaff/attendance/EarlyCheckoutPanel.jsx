'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function EarlyCheckoutPanel({ records }) {
  const early = (records || []).filter((r) => r.status === 'Early Exit')

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-rose-100 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-rose-900">Early Check-outs</CardTitle>
      </CardHeader>
      <CardContent className="pt-1 space-y-1 text-[11px] text-slate-700">
        {early.length === 0 && <p className="text-rose-700/80">No early exits for this date.</p>}
        {early.map((r) => (
          <div key={r.id} className="flex items-center justify-between border-b border-rose-100/70 pb-0.5">
            <div>
              <div className="font-semibold text-slate-900">{r.staffName}</div>
              <div className="text-[10px] text-slate-600">
                {r.department || '—'} • Shift {r.shift}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-rose-800">{r.checkOutTime || '—'}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

