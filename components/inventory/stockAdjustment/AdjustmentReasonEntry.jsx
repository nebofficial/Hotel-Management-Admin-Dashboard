'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileQuestion } from 'lucide-react'

export default function AdjustmentReasonEntry({ value, onChange, required = true }) {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
          <FileQuestion className="h-4 w-4" />
          Reason for Adjustment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="text-gray-700">Reason (required for audit trail)</Label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Physical count discrepancy, Damaged during handling..."
          rows={3}
          className="mt-1 rounded-xl"
          required={required}
        />
      </CardContent>
    </Card>
  )
}
