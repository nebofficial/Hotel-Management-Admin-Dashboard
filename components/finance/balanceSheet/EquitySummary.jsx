'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EquitySummary({ equity, currentYearProfit }) {
  const totalEquity = Number(equity?.totalEquity || 0)
  const accounts = equity?.accounts || []
  const profit = Number(currentYearProfit || 0)

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Equity Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-bold">
          ₹{totalEquity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-sky-100 text-xs">Owner's Equity (excluding current year profit display)</p>
        <div className="space-y-1 max-h-[120px] overflow-y-auto text-xs">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white/10 rounded-xl px-2 py-1"
            >
              <span className="text-sky-100">{a.name}</span>
              <span className="font-semibold">
                ₹{Number(a.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            </div>
          ))}
          {accounts.length === 0 && (
            <p className="text-sky-100 text-xs">No equity accounts configured.</p>
          )}
        </div>
        <div className="bg-white/10 rounded-xl p-2 text-xs flex items-center justify-between">
          <span className="text-sky-100">Current Year Profit (from P&L)</span>
          <span className="font-semibold">
            ₹{profit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

