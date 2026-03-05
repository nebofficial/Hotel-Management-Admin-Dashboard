'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FinancialSnapshot({ assetsTotal, liabilitiesTotal, equityTotal, isBalanced }) {
  const difference = assetsTotal - (liabilitiesTotal + equityTotal)

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Financial Position Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-violet-100">Assets</p>
            <p className="font-semibold">
              ₹{assetsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-violet-100">Liabilities</p>
            <p className="font-semibold">
              ₹{liabilitiesTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-violet-100">Equity</p>
            <p className="font-semibold">
              ₹{equityTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div
          className={`rounded-xl px-3 py-2 flex items-center justify-between text-xs ${
            isBalanced ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          <div>
            <p className="font-semibold">
              {isBalanced ? 'Balanced' : 'Not Balanced'}
            </p>
            <p className="text-[11px]">
              Assets vs Liabilities + Equity difference:{' '}
              ₹{difference.toFixed(2)}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white text-violet-700 text-[11px] font-semibold">
            {isBalanced ? 'OK' : 'CHECK'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

