'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DoubleEntryValidation({ totalDebit, totalCredit }) {
  const diff = Number(totalDebit || 0) - Number(totalCredit || 0)
  const balanced = Math.abs(diff) < 0.001 && totalDebit > 0

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-blue-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Double Entry Validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-xs">
          <span>Debit Total</span>
          <span className="font-semibold">₹{Number(totalDebit || 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>Credit Total</span>
          <span className="font-semibold">₹{Number(totalCredit || 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>Difference</span>
          <span className="font-semibold">
            ₹{diff.toFixed(2)}
          </span>
        </div>
        <div
          className={`mt-2 rounded-xl px-2 py-1 text-xs font-semibold text-center ${
            balanced ? 'bg-emerald-400' : 'bg-red-500'
          }`}
        >
          {balanced ? 'Balanced' : 'Not Balanced'}
        </div>
      </CardContent>
    </Card>
  )
}

