'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const REASONS = [
  'Change of plan',
  'Medical emergency',
  'Flight cancellation',
  'Price issue',
  'Other',
]

export default function CancellationReasonForm({ value, onChange }) {
  const v = value || {}
  const set = (patch) => onChange?.({ ...v, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-900 text-base">Cancellation Reason</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-2 text-xs">
        <div>
          <Label className="text-gray-700 text-xs">Reason Category</Label>
          <select
            value={v.category || ''}
            onChange={(e) => set({ category: e.target.value })}
            className="mt-1 w-full h-8 rounded-md border border-gray-300 text-xs"
          >
            <option value="">Select reason</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-gray-700 text-xs">Details (required)</Label>
          <Textarea
            value={v.details || ''}
            onChange={(e) => set({ details: e.target.value })}
            className="mt-1 h-20 resize-none text-xs"
            placeholder="Short explanation for audit and analytics…"
          />
        </div>
      </CardContent>
    </Card>
  )
}

