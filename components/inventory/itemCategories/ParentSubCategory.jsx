'use client'

import { Label } from '@/components/ui/label'

export default function ParentSubCategory({ categories = [], parentId, onParentChange }) {
  const parents = categories.filter((c) => !c.parentId)

  return (
    <div className="space-y-1.5">
      <Label htmlFor="parent-category">Parent Category</Label>
      <select
        id="parent-category"
        value={parentId || ''}
        onChange={(e) => onParentChange?.(e.target.value || null)}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">None (Top level)</option>
        {parents.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500">Use this to nest sub-categories under a parent.</p>
    </div>
  )
}

