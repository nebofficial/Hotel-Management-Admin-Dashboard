'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CommissionStatsCards({ reports }) {
  const s = reports?.summary || {}
  const total = s.totalCommission ?? 0
  const paid = s.totalPaid ?? 0
  const pending = s.totalPending ?? 0

  const cards = [
    {
      label: 'Total Commission',
      value: total.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      gradient: 'from-emerald-500 to-mint-400',
    },
    {
      label: 'Commission Paid',
      value: paid.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      gradient: 'from-sky-500 to-blue-500',
    },
    {
      label: 'Pending Payout',
      value: pending.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Transactions',
      value: s.transactionCount ?? 0,
      gradient: 'from-violet-500 to-purple-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className={`bg-gradient-to-br ${c.gradient} text-white shadow-md border-none rounded-2xl`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium uppercase opacity-90">
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

