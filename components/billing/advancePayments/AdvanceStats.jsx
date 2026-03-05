'use client'

import { Card, CardContent } from '@/components/ui/card'
import { IndianRupee, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'

export default function AdvanceStats({ summary = {} }) {
  const {
    totalCollected = 0,
    totalAdjusted = 0,
    totalRefunded = 0,
    balanceAvailable = 0,
  } = summary

  const cards = [
    {
      label: 'Total Advance Collected',
      value: `₹${totalCollected.toFixed(2)}`,
      icon: IndianRupee,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Total Adjusted',
      value: `₹${totalAdjusted.toFixed(2)}`,
      icon: ArrowDownCircle,
      gradient: 'from-sky-500 to-cyan-600',
    },
    {
      label: 'Total Refunded',
      value: `₹${totalRefunded.toFixed(2)}`,
      icon: ArrowUpCircle,
      gradient: 'from-rose-500 to-red-600',
    },
    {
      label: 'Balance Advance',
      value: `₹${balanceAvailable.toFixed(2)}`,
      icon: Wallet,
      gradient: 'from-amber-500 to-yellow-500',
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

