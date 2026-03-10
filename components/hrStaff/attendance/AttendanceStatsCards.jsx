'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AttendanceStatsCards({ summary }) {
  const { totalStaff = 0, present = 0, absent = 0, attendanceRate = 0 } = summary || {}

  const cards = [
    {
      label: 'Total Staff Today',
      value: totalStaff,
      gradient: 'from-emerald-500/90 to-teal-500',
    },
    {
      label: 'Present',
      value: present,
      gradient: 'from-sky-500/90 to-blue-500',
    },
    {
      label: 'Absent',
      value: absent,
      gradient: 'from-rose-500/90 to-red-500',
    },
    {
      label: 'Attendance Rate',
      value: `${attendanceRate.toFixed ? attendanceRate.toFixed(1) : attendanceRate}%`,
      gradient: 'from-emerald-400/90 to-mint-400',
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
            <CardTitle className="text-[11px] font-medium tracking-wide uppercase opacity-90">
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

