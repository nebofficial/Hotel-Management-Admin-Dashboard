'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Hash } from 'lucide-react'

export default function AutoPONumberGeneration({ orderNumber, readOnly = true }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="po-number" className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-slate-600" />
        PO Number
      </Label>
      <Input
        id="po-number"
        value={orderNumber || ''}
        readOnly={readOnly}
        className="bg-slate-50 font-mono font-semibold text-blue-600"
        placeholder="Auto-generated"
      />
      <p className="text-xs text-slate-500">Automatically generated unique purchase order number</p>
    </div>
  )
}
