'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const DEFAULT_SHIFTS = [
  { id: 'MORNING', label: 'Morning' },
  { id: 'EVENING', label: 'Evening' },
  { id: 'NIGHT', label: 'Night' },
]

export default function ShiftClosing({ shifts, onChange, locked }) {
  const data = shifts?.length ? shifts : DEFAULT_SHIFTS.map((s) => ({ ...s, revenue: 0, cash: 0 }))

  const updateShift = (id, patch) => {
    const next = data.map((s) => (s.id === id ? { ...s, ...patch } : s))
    onChange?.(next)
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Shift Closing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {data.map((s) => (
          <div key={s.id} className="bg-white/10 rounded-xl p-2 grid grid-cols-3 gap-2 items-end">
            <div>
              <p className="font-semibold text-sm">{s.label}</p>
              <p className="text-[10px] text-purple-100 uppercase">{s.id}</p>
            </div>
            <div>
              <Label className="text-[11px]">Revenue</Label>
              <input
                type="number"
                disabled={locked}
                value={s.revenue ?? 0}
                onChange={(e) => updateShift(s.id, { revenue: Number(e.target.value || 0) })}
                className="mt-1 w-full rounded-lg border border-purple-200 px-2 py-1 text-xs text-purple-900"
              />
            </div>
            <div>
              <Label className="text-[11px]">Cash</Label>
              <input
                type="number"
                disabled={locked}
                value={s.cash ?? 0}
                onChange={(e) => updateShift(s.id, { cash: Number(e.target.value || 0) })}
                className="mt-1 w-full rounded-lg border border-purple-200 px-2 py-1 text-xs text-purple-900"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

