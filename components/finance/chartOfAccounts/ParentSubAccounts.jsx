'use client'

import { Label } from '@/components/ui/label'

export default function ParentSubAccounts({ accounts, parentId, onChange, currentId }) {
  const options = (accounts || []).filter((a) => a.id !== currentId)

  return (
    <div>
      <Label className="text-gray-700">Parent Account (optional)</Label>
      <select
        value={parentId || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 bg-white"
      >
        <option value="">None (top-level)</option>
        {options.map((a) => (
          <option key={a.id} value={a.id}>
            {a.code} — {a.name}
          </option>
        ))}
      </select>
    </div>
  )
}
