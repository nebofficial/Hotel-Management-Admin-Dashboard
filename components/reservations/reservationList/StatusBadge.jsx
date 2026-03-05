'use client'

import { Badge } from '@/components/ui/badge'

const COLOR_MAP = {
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  checked_in: 'bg-sky-100 text-sky-800 border-sky-200',
  checked_out: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  no_show: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
}

export default function StatusBadge({ status, isNoShow }) {
  let key = String(status || '').toLowerCase()
  if (isNoShow) key = 'no_show'

  const labelMap = {
    confirmed: 'Confirmed',
    pending: 'Pending',
    checked_in: 'Checked-in',
    checked_out: 'Checked-out',
    cancelled: isNoShow ? 'No-show' : 'Cancelled',
    no_show: 'No-show',
  }

  const label = labelMap[key] || 'Pending'
  const classes = COLOR_MAP[key] || COLOR_MAP.pending

  return (
    <Badge variant="outline" className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${classes}`}>
      {label}
    </Badge>
  )
}

