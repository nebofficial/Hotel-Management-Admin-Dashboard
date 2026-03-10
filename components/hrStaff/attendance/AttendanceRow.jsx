'use client'

import { AttendanceStatusBadge } from './AttendanceStatusBadge'

export function AttendanceRow({ record }) {
  const r = record || {}

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60">
      <td className="py-2 px-2 text-xs font-medium text-slate-900 whitespace-nowrap">{r.staffName}</td>
      <td className="py-2 px-2 text-[11px] text-slate-600 whitespace-nowrap hidden md:table-cell">
        {r.department || '—'}
      </td>
      <td className="py-2 px-2 text-[11px] text-slate-600 whitespace-nowrap hidden sm:table-cell">
        {r.shift}
      </td>
      <td className="py-2 px-2 text-[11px] text-slate-700 whitespace-nowrap">
        {r.checkInTime || '—'}
      </td>
      <td className="py-2 px-2 text-[11px] text-slate-700 whitespace-nowrap">
        {r.checkOutTime || '—'}
      </td>
      <td className="py-2 px-2 text-[11px] text-slate-700 text-right whitespace-nowrap">
        {r.workHours != null ? r.workHours.toFixed(1) : '—'}
      </td>
      <td className="py-2 px-2 text-right">
        <AttendanceStatusBadge status={r.status} />
      </td>
    </tr>
  )
}

