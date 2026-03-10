'use client'

import { Button } from '@/components/ui/button'

export function RoleRow({ role, onEdit, onSelect }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60">
      <td className="py-2 px-2 text-xs font-medium text-slate-900 cursor-pointer" onClick={() => onSelect?.(role)}>
        {role.name}
      </td>
      <td className="py-2 px-2 text-[11px] text-slate-600">{role.description}</td>
      <td className="py-2 px-2 text-[11px] text-slate-600">
        {Array.from(new Set((role.permissions || []).map((p) => String(p).split(':')[0]))).join(', ') || '—'}
      </td>
      <td className="py-2 px-2 text-right">
        <Button type="button" size="xs" variant="outline" className="h-7 text-[11px]" onClick={() => onEdit?.(role)}>
          Edit
        </Button>
      </td>
    </tr>
  )
}

