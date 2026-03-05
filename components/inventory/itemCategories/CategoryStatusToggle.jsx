'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function CategoryStatusToggle({ checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
      <div className="space-y-0.5">
        <Label className="text-sm">Active</Label>
        <p className="text-xs text-slate-500">Inactive categories can be hidden from selection.</p>
      </div>
      <Switch checked={Boolean(checked)} onCheckedChange={onCheckedChange} />
    </div>
  )
}

