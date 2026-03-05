'use client'

import { Label } from '@/components/ui/label'

const TYPES = [
  { value: 'Asset', label: 'Asset', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'Liability', label: 'Liability', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'Income', label: 'Income', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'Expense', label: 'Expense', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'Equity', label: 'Equity', color: 'bg-purple-100 text-purple-800 border-purple-200' },
]

export default function AccountTypeSelector({ value, onChange }) {
  return (
    <div>
      <Label className="text-gray-700">Account Type</Label>
      <select
        value={value || 'Asset'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 bg-white"
      >
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2 mt-2">
        {TYPES.map((t) => (
          <span
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer ${t.color} ${value === t.value ? 'ring-2 ring-offset-1 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  )
}
