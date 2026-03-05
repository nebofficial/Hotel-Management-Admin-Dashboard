'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

const cards = [
  { id: 'revenue', label: 'Revenue', valueKey: 'totalRevenue', icon: DollarSign, color: 'from-green-500 to-emerald-600', prefix: '$' },
  { id: 'expenses', label: 'Expenses', valueKey: 'totalExpenses', icon: TrendingDown, color: 'from-red-500 to-rose-600', prefix: '$' },
  { id: 'profit', label: 'Net Profit', valueKey: 'netProfit', icon: TrendingUp, color: 'from-blue-500 to-cyan-600', prefix: '$' },
  { id: 'cashflow', label: 'Cash Flow', valueKey: 'netProfit', icon: Wallet, color: 'from-amber-500 to-orange-600', prefix: '$' },
]

export default function KPICards({ data }) {
  const formatVal = (key) => {
    const v = data?.[key] ?? 0
    return `${Number(v) >= 0 ? '' : '-'}$${Math.abs(Number(v)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        const value = c.valueKey === 'netProfit' ? formatVal('netProfit') : (c.prefix + (Number(data?.[c.valueKey] ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })))
        return (
          <Card key={c.id} className="border-0 shadow-xl rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-200 bg-white/80 backdrop-blur">
            <div className={`bg-gradient-to-br ${c.color} p-5`}>
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {c.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-white">{value}</div>
              </CardContent>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
