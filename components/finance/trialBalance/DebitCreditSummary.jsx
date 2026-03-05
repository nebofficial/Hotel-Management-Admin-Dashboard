'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

export default function DebitCreditSummary({ totalDebit = 0, totalCredit = 0, isBalanced = false }) {
  const fmt = (n) =>
    '\u20B9' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {isBalanced ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
              Balanced
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-amber-200" />
              Not Balanced
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-100 text-xs">Total Debit</p>
            <p className="text-xl font-bold">{fmt(totalDebit)}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-100 text-xs">Total Credit</p>
            <p className="text-xl font-bold">{fmt(totalCredit)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
