'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NetProfitCard({ incomeTotal, expenseTotal }) {
  const income = Number(incomeTotal || 0)
  const expenses = Number(expenseTotal || 0)
  const net = income - expenses
  const isProfit = net >= 0

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Net Profit / Loss</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-sky-100">Total Income</p>
            <p className="font-semibold">
              ₹{income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-sky-100">Total Expenses</p>
            <p className="font-semibold">
              ₹{expenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div
          className={`rounded-xl p-3 flex items-center justify-between ${
            isProfit ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          <div>
            <p className="text-xs">{isProfit ? 'Net Profit' : 'Net Loss'}</p>
            <p className="text-xl font-bold">
              ₹{Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-sky-700">
            {isProfit ? 'PROFIT' : 'LOSS'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

