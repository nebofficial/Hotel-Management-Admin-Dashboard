'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function GroupRateManager({ value, onChange, totals }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900">
      <CardHeader>
        <CardTitle className="text-slate-900 text-sm">Group Rate & Discount</CardTitle>
        <div className="text-xs text-slate-800/90">
          Select a base rate plan and apply group discounts. Totals update automatically.
        </div>
      </CardHeader>
      <CardContent className="bg-white/40 backdrop-blur-sm rounded-t-2xl space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-slate-800">Base Rate Plan</Label>
            <Select
              value={v.ratePlan || 'standard'}
              onValueChange={(ratePlan) => set({ ratePlan })}
            >
              <SelectTrigger className="mt-1 h-8 bg-white border-amber-200">
                <SelectValue placeholder="Select rate plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-slate-700">Base Amount</div>
            <div className="text-base font-semibold">
              {totals ? totals.baseAmount.toFixed(2) : '—'}
            </div>
          </div>
          <div>
            <div className="text-slate-700">Discount</div>
            <div className="text-base font-semibold">
              {totals ? totals.discountAmount.toFixed(2) : '—'}
            </div>
          </div>
          <div>
            <div className="text-slate-700">Final Total</div>
            <div className="text-base font-bold">
              {totals ? totals.finalAmount.toFixed(2) : '—'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

