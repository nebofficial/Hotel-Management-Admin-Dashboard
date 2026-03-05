'use client'

import { Card, CardContent } from '@/components/ui/card'
import { IndianRupee, Clock, AlertTriangle, ScrollText } from 'lucide-react'

export default function CreditNoteStats({ stats = {}, expiryInfo = {} }) {
  const {
    totalIssued = 0,
    outstandingBalance = 0,
    usedThisMonth = 0,
  } = stats

  const { expiringSoon = [], expired = [] } = expiryInfo

  const cards = [
    {
      label: 'Total Credit Notes',
      value: totalIssued,
      gradient: 'from-emerald-500 to-teal-600',
      icon: ScrollText,
    },
    {
      label: 'Outstanding Balance',
      value: `₹${Number(outstandingBalance).toFixed(2)}`,
      gradient: 'from-emerald-500 to-teal-600',
      icon: IndianRupee,
    },
    {
      label: 'Credits Used This Month',
      value: `₹${Number(usedThisMonth).toFixed(2)}`,
      gradient: 'from-sky-500 to-cyan-600',
      icon: Clock,
    },
    {
      label: 'Expiring Soon',
      value: `${expiringSoon.length} / Expired ${expired.length}`,
      gradient: 'from-amber-500 to-red-500',
      icon: AlertTriangle,
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

