'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ShiftRow({ shift, onEdit, onAssign }) {
  const isNight = shift?.isNightShift
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60">
      <td className="py-2 px-2 text-xs font-medium text-slate-900">{shift.shiftId}</td>
      <td className="py-2 px-2 text-xs font-medium text-slate-900">{shift.name}</td>
      <td className="py-2 px-2 text-[11px] text-slate-600">
        {shift.startTime} to {shift.endTime}
      </td>
      <td className="py-2 px-2 text-[11px] text-slate-600">{shift.breakMinutes || 0} min</td>
      <td className="py-2 px-2">
        {isNight ? (
          <Badge variant="secondary" className="bg-rose-100 text-rose-700 text-[10px]">Night</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px]">{shift.shiftType}</Badge>
        )}
      </td>
      <td className="py-2 px-2">
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${shift.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {shift.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-2 px-2 text-right">
        <div className="flex gap-1 justify-end">
          <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => onEdit?.(shift)}>Edit</Button>
          <Button type="button" size="sm" className="h-7 text-[11px] bg-violet-600 hover:bg-violet-700" onClick={() => onAssign?.(shift)}>Assign</Button>
        </div>
      </td>
    </tr>
  )
}
