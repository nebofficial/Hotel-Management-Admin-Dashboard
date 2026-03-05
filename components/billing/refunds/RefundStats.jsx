'use client'

import { Card, CardContent } from '@/components/ui/card'
import { IndianRupee, Clock, CheckCircle2 } from 'lucide-react'

export default function RefundStats({ stats = {} }) {
  const {
    totalToday = 0,
    pending = 0,
    completed = 0,
    amountToday = 0,
  } = stats

  const cards = [
    {
      label: 'Refunds Today',
      value: totalToday,
      gradient: 'from-emerald-500 to-teal-600',
      icon: CheckCircle2,
    },
    {
      label: 'Pending Approvals',
      value: pending,
      gradient: 'from-amber-500 to-yellow-500',
      icon: Clock,
    },
    {
      label: 'Completed Refunds',
      value: completed,
      gradient: 'from-sky-500 to-cyan-600',
      icon: CheckCircle2,
    },
    {
      label: 'Amount Refunded Today',
      value: `₹${Number(amountToday).toFixed(2)}`,
      gradient: 'from-rose-500 to-red-600',
      icon: IndianRupee,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-slate-900/90 text-white relative"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-80`} />
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-100/80">{c.label}</p>
                <p className="text-xl font-bold mt-1">{c.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <c.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

