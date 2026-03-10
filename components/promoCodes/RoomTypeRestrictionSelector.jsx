'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function RoomTypeRestrictionSelector({ value = [], onChange, placeholder = 'Deluxe, Suite, Standard...', labelClassName = 'text-[11px] text-slate-600', hintClassName = 'text-[10px] text-slate-500', inputClassName }) {
  const str = Array.isArray(value) ? value.join(', ') : (value || '')
  return (
    <div className="space-y-1">
      <Label className={labelClassName}>Room Type Restrictions</Label>
      <Input
        type="text"
        placeholder={placeholder}
        className={inputClassName || 'h-8 text-xs'}
        value={str}
        onChange={(e) => {
          const next = e.target.value.split(',').map((r) => r.trim()).filter(Boolean)
          onChange?.(next)
        }}
      />
      <p className={hintClassName}>Leave empty for all rooms. Comma-separated for specific types.</p>
    </div>
  )
}
