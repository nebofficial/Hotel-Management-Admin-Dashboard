'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Receipt, IndianRupee, Clock, RotateCcw } from 'lucide-react'

export default function BillStats({ stats = {} }) {
  const {
    totalBillsToday = 0,
    totalRevenue = 0,
    pendingSettlements = 0,
    refundedBills = 0,
  } = stats

  const cards = [
    {
      label: 'Total Bills Today',
      value: totalBillsToday,
      icon: Receipt,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50/80',
    },
    {
      label: 'Total Revenue',
      value: `₹${Number(totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: IndianRupee,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50/80',
    },
    {
      label: 'Pending Settlements',
      value: pendingSettlements,
      icon: Clock,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50/80',
    },
    {
      label: 'Refunded Bills',
      value: refundedBills,
      icon: RotateCcw,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50/80',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className={`overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow ${c.bg}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">{c.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{c.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${c.gradient} text-white`}>
                <c.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
