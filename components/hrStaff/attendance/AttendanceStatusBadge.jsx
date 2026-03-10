'use client'

import { Badge } from '@/components/ui/badge'

const COLORS = {
  Present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Absent: 'bg-rose-100 text-rose-700 border-rose-200',
  Late: 'bg-amber-100 text-amber-700 border-amber-200',
  'Early Exit': 'bg-orange-100 text-orange-700 border-orange-200',
}

export function AttendanceStatusBadge({ status }) {
  const label = status || 'Present'
  const cls = COLORS[label] || COLORS.Present
  return (
    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${cls}`}>
      {label}
    </Badge>
  )
}

