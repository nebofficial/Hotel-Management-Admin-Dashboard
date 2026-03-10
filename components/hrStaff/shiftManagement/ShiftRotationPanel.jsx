'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ShiftRotationPanel({ shifts = [] }) {
  const order = ['Morning', 'Evening', 'Night']
  const sorted = [...shifts].sort((a, b) => order.indexOf(a.shiftType) - order.indexOf(b.shiftType))

  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-orange-100 to-amber-100">
        <CardTitle className="text-sm font-semibold text-slate-900">Shift Rotation</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-[11px] text-slate-600 mb-2">Example rotation: Morning → Evening → Night</p>
        <div className="flex flex-wrap gap-2">
          {sorted.map((s, i) => (
            <span key={s.id} className="px-2 py-1 rounded bg-white border border-orange-200 text-[11px] font-medium">
              {i > 0 && <span className="text-orange-400 mr-1">→</span>}
              {s.name}
            </span>
          ))}
          {sorted.length === 0 && <span className="text-slate-500 text-[11px]">Create shifts to see rotation</span>}
        </div>
      </CardContent>
    </Card>
  )
}
