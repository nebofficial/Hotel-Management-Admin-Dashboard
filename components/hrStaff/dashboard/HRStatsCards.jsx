'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function HRStatsCards({ summary }) {
  const { totalStaff = 0, onDutyToday = 0, onLeaveToday = 0, attendanceRate = 0 } = summary || {}

  const formatPct = (v) => `${(Number(v) || 0).toFixed(1)}%`

  const cards = [
    {
      label: 'Total Staff',
      value: totalStaff,
      gradient: 'from-emerald-500/90 to-teal-500',
    },
    {
      label: 'On Duty Today',
      value: onDutyToday,
      gradient: 'from-sky-500/90 to-blue-500',
    },
    {
      label: 'On Leave',
      value: onLeaveToday,
      gradient: 'from-violet-500/90 to-purple-500',
    },
    {
      label: 'Attendance Rate',
      value: formatPct(attendanceRate),
      gradient: 'from-amber-500/90 to-yellow-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white shadow-md`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium tracking-wide uppercase opacity-90">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

