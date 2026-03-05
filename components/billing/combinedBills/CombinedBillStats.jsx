'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, IndianRupee, Receipt, AlertTriangle } from 'lucide-react'

export default function CombinedBillStats({ summary = {} }) {
  const {
    roomTotal = 0,
    restaurantTotal = 0,
    otherTotal = 0,
    advanceTotal = 0,
    balance = 0,
  } = summary

  const cards = [
    {
      label: 'Room Charges',
      value: `₹${roomTotal.toFixed(2)}`,
      icon: Receipt,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Restaurant Charges',
      value: `₹${restaurantTotal.toFixed(2)}`,
      icon: Users,
      gradient: 'from-sky-500 to-cyan-600',
    },
    {
      label: 'Other Charges',
      value: `₹${otherTotal.toFixed(2)}`,
      icon: AlertTriangle,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      label: 'Net Balance',
      value: `₹${balance.toFixed(2)}`,
      icon: IndianRupee,
      gradient: balance <= 0 ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-red-600',
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

