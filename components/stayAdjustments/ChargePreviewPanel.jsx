'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChargePreviewPanel({ baseEstimate, chargeSummary, appliedCharges }) {
  const base = Number(baseEstimate || 0)
  const extra = Number(chargeSummary?.totalExtraCharge || 0)
  const alreadyApplied =
    Array.isArray(appliedCharges) && appliedCharges.length
      ? appliedCharges.reduce((s, c) => s + Number(c.amount || 0), 0)
      : 0

  const newTotal = base + alreadyApplied + extra

  const format = (v) => `₹${Number(v || 0).toFixed(2)}`

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Charge Preview</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-white/80">Base Bill (est.)</span>
          <span className="font-semibold text-sm">{format(base)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/80">Existing Early/Late Charges</span>
          <span className="font-semibold text-sm">{format(alreadyApplied)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/80">New Adjustment</span>
          <span className="font-semibold text-sm">+{format(extra)}</span>
        </div>
        <hr className="border-white/20" />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Updated Total (est.)</span>
          <span className="font-bold text-lg">{format(newTotal)}</span>
        </div>
        {appliedCharges?.length ? (
          <div className="mt-2 text-[11px] text-amber-100">
            Existing charges:
            {appliedCharges.map((c, i) => (
              <span key={c.id || i} className="ml-1">
                {c.type} ₹{Number(c.amount || 0).toFixed(0)}
                {i < appliedCharges.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

