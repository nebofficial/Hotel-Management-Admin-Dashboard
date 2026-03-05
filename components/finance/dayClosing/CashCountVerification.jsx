'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function CashCountVerification({ cash, onChange, locked }) {
  const systemCash = cash?.systemCash || 0
  const physicalCash = cash?.physicalCash || 0
  const cashDifference = cash?.cashDifference ?? physicalCash - systemCash
  const mismatch = cashDifference !== 0

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-400 text-amber-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cash Count Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/70 rounded-xl p-2">
            <p className="text-xs text-gray-700">System Cash</p>
            <p className="font-semibold">
              ${systemCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/70 rounded-xl p-2">
            <Label className="text-xs text-gray-700">Physical Cash</Label>
            <input
              type="number"
              disabled={locked}
              value={physicalCash}
              onChange={(e) => onChange?.({ physicalCash: Number(e.target.value || 0) })}
              className="mt-1 w-full rounded-lg border border-amber-300 px-2 py-1 text-sm bg-white"
            />
          </div>
        </div>
        <div
          className={`rounded-xl p-2 ${
            mismatch ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          <p className="text-xs">{mismatch ? 'Cash Difference (Short / Excess)' : 'Cash Matched'}</p>
          <p className="font-semibold">
            ${cashDifference.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

