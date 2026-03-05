'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExpenseSummary({ expenses }) {
  const total = Number(expenses?.totalExpenses || 0)
  const byCategory = expenses?.byCategory || {}
  const categories = Object.entries(byCategory)
  const highest = categories.reduce(
    (acc, [cat, val]) => (val > acc.amount ? { category: cat, amount: val } : acc),
    { category: null, amount: 0 }
  )

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 to-red-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Expense Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-bold">
          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-rose-100 text-xs">Total operating expenses</p>
        <div className="space-y-1 max-h-[160px] overflow-y-auto text-xs">
          {categories.map(([cat, val]) => (
            <div
              key={cat}
              className={`flex items-center justify-between bg-white/10 rounded-xl px-2 py-1 ${
                highest.category === cat ? 'border border-yellow-300' : ''
              }`}
            >
              <span className="text-rose-100">{cat}</span>
              <span className="font-semibold">
                ₹{Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-rose-100 text-xs">No expenses found for this period.</p>
          )}
        </div>
        {highest.category && (
          <p className="text-[11px] text-yellow-200">
            Highest expense: <span className="font-semibold">{highest.category}</span> (
            ₹{Number(highest.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })})
          </p>
        )}
      </CardContent>
    </Card>
  )
}

