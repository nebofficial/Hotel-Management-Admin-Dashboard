'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Package } from 'lucide-react'

export default function BatchManagement({ batchNumber, onBatchChange }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="batch-number" className="flex items-center gap-2">
        <Package className="h-4 w-4 text-slate-600" />
        Batch Number
      </Label>
      <Input
        id="batch-number"
        value={batchNumber || ''}
        onChange={(e) => onBatchChange?.(e.target.value || null)}
        placeholder="e.g., BATCH-2024-001"
        className="text-sm"
      />
      <p className="text-xs text-slate-500">Track items by batch for better inventory management.</p>
    </div>
  )
}
