'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, DollarSign, CheckCircle2, Clock } from 'lucide-react'

function AnimatedCounter({ value, duration = 600 }) {
  const [display, setDisplay] = useState(0)
  const num = Number(value) || 0

  useEffect(() => {
    let start = display
    const end = num
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) ** 2
      const current = Math.round(start + (end - start) * eased)
      setDisplay(current)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [num, duration])

  return <span>{display.toLocaleString()}</span>
}

const KPI_CARDS = [
  {
    key: 'totalBills',
    label: 'Total Bills Generated',
    icon: FileText,
    href: '/billing/roombills',
    color: 'from-emerald-500 to-green-400',
  },
  {
    key: 'totalBilledAmount',
    label: 'Total Billed Amount',
    icon: DollarSign,
    href: '/billing/roombills',
    color: 'from-emerald-600 to-teal-500',
    isCurrency: true,
  },
  {
    key: 'paidBills',
    label: 'Paid Bills',
    icon: CheckCircle2,
    href: '/accounting/invoices?status=PAID',
    color: 'from-green-500 to-emerald-400',
  },
  {
    key: 'pendingAmount',
    label: 'Pending Payments',
    icon: Clock,
    href: '/accounting/invoices?status=PENDING',
    color: 'from-teal-500 to-cyan-400',
    isCurrency: true,
  },
]

export default function KPISection({ kpis = {}, onClick }) {
  const fmt = (n) =>
    '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CARDS.map((card) => {
        const Icon = card.icon
        const val = kpis[card.key] ?? 0
        return (
          <Card
            key={card.key}
            className={`border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br ${card.color} text-white cursor-pointer hover:scale-[1.02] transition-transform`}
            onClick={() => onClick?.(card.href)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/90 text-xs font-medium">{card.label}</p>
                  <p className="text-2xl font-bold mt-1">
                    {card.isCurrency ? fmt(val) : <AnimatedCounter value={val} />}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
