'use client'

import { Label } from '@/components/ui/label'

const UNITS = ['Kg', 'Liter', 'Piece', 'Box', 'Pack', 'Bottle', 'Can', 'Gram', 'Milliliter', 'Dozen', 'Set', 'Unit']

export default function ItemUnitSelection({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="item-unit">Unit</Label>
      <select
        id="item-unit"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value || null)}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select unit…</option>
        {UNITS.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  )
}
