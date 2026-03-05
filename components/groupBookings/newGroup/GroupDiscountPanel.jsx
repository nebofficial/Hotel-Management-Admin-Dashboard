'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function GroupDiscountPanel({ value, onChange }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-amber-300 via-yellow-300 to-lime-300 text-slate-900">
      <CardHeader>
        <CardTitle className="text-slate-900 text-sm">Group Discount</CardTitle>
        <div className="text-xs text-slate-800/90">
          Apply % or flat discounts. Both can be combined for special corporate pricing.
        </div>
      </CardHeader>
      <CardContent className="bg-white/50 backdrop-blur-sm rounded-t-2xl space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-slate-800">% Discount</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={100}
                value={v.discountPercent || 0}
                onChange={(e) => set({ discountPercent: Math.max(0, Number(e.target.value || 0)) })}
                className="mt-1 h-8"
              />
              <span className="text-slate-700 mt-1">%</span>
            </div>
          </div>
          <div>
            <Label className="text-slate-800">Flat Discount</Label>
            <Input
              type="number"
              min={0}
              value={v.discountFlat || 0}
              onChange={(e) => set({ discountFlat: Math.max(0, Number(e.target.value || 0)) })}
              className="mt-1 h-8"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

