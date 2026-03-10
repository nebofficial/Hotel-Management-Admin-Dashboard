'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PayrollStatsCards({ reports }) {
  const s = reports?.summary || {}
  const totalNet = s.totalNet ?? 0
  const totalPending = s.totalPending ?? 0
  const empCount = s.employeeCount ?? 0

  const cards = [
    { label: 'Total Payroll', value: totalNet.toLocaleString('en-IN', { maximumFractionDigits: 0 }), gradient: 'from-emerald-500 to-teal-400' },
    { label: 'Employees', value: empCount, gradient: 'from-sky-500 to-blue-500' },
    { label: 'Pending', value: totalPending.toLocaleString('en-IN', { maximumFractionDigits: 0 }), gradient: 'from-amber-500 to-orange-500' },
    { label: 'Bonuses', value: '-', gradient: 'from-violet-500 to-purple-500' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className={`bg-gradient-to-br ${c.gradient} text-white shadow-md border-none rounded-2xl`}>
          <CardHeader className="pb-2"><CardTitle className="text-[11px] font-medium uppercase opacity-90">{c.label}</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{c.value}</div></CardContent>
        </Card>
      ))}
    </div>
  )
}
