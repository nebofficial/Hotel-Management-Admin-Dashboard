'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RatePlanSelector({ value, onChange, quote }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900">
      <CardHeader>
        <CardTitle className="text-slate-900">Rate Plan & Pricing</CardTitle>
        <div className="text-slate-800/80 text-sm">
          Pricing updates automatically based on dates, occupancy, and rate plan.
        </div>
      </CardHeader>
      <CardContent className="bg-white/30 backdrop-blur-sm rounded-t-2xl space-y-4">
        <Select value={value || 'standard'} onValueChange={onChange}>
          <SelectTrigger className="bg-white/70 border-white/60">
            <SelectValue placeholder="Select Rate Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-slate-700">Nights</div>
          <div className="text-right font-semibold">
            {quote && typeof quote.nights !== 'undefined' ? quote.nights : '—'}
          </div>
          <div className="text-slate-700">Room Cost</div>
          <div className="text-right font-semibold">{quote ? quote.roomCost : '—'}</div>
          <div className="text-slate-700">Extras</div>
          <div className="text-right font-semibold">{quote ? quote.extrasCost : '—'}</div>
          <div className="text-slate-700">Total Stay Cost</div>
          <div className="text-right text-base font-bold">{quote ? quote.total : '—'}</div>
        </div>
      </CardContent>
    </Card>
  )
}

