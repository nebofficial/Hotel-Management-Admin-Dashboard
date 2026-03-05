'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CategoryDescription({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="category-description">Description</Label>
      <Textarea
        id="category-description"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Add a detailed description for this category…"
        className="min-h-[88px]"
      />
    </div>
  )
}

