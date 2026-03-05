'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText } from 'lucide-react'

export default function TransferNotes({ value, onChange }) {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
          <FileText className="h-4 w-4" />
          Transfer Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="text-gray-700">Notes / Remarks (audit trail)</Label>
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="Optional notes for this transfer..." rows={3} className="mt-1" />
      </CardContent>
    </Card>
  )
}
