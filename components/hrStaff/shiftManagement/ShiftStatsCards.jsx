'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ShiftStatsCards({ shifts = [], schedule = { days: [] }, changeRequests = [] }) {
  const totalShifts = shifts?.length || 0
  const activeShifts = shifts?.filter((s) => s.isActive !== false)?.length ?? totalShifts
  const nightShifts = shifts?.filter((s) => s.isNightShift)?.length || 0
  let staffToday = 0
  const today = new Date().toISOString().slice(0, 10)
  schedule?.days?.forEach((d) => {
    if (d.date === today) staffToday += (d.assignments || []).length
  })
  const pendingRequests = changeRequests?.filter((r) => r.status === 'pending')?.length || 0

  const cards = [
    { label: 'Total Shifts', value: totalShifts, gradient: 'from-emerald-500 to-teal-400', icon: '📊' },
    { label: 'Staff Assigned Today', value: staffToday, gradient: 'from-sky-500 to-blue-500', icon: '👤' },
    { label: 'Night Shifts Active', value: nightShifts, gradient: 'from-rose-500 to-red-500', icon: '🌙' },
    { label: 'Pending Change Requests', value: pendingRequests, gradient: 'from-amber-600 to-orange-500', icon: '📩' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className={`bg-gradient-to-br ${c.gradient} text-white shadow-md border-none rounded-2xl overflow-hidden`}>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[11px] font-medium tracking-wide uppercase opacity-90 flex items-center gap-2">
              <span>{c.icon}</span>
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-2xl font-semibold tracking-tight">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
