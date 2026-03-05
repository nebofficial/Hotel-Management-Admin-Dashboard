'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const OPTIONS = [
  { label: '15 Days', value: 15 },
  { label: '30 Days', value: 30 },
  { label: '45 Days', value: 45 },
]

export function CreditPeriodSetup({ value, onChange }) {
  const val = value || 30

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-lime-50 border-lime-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-lime-700">Payment Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label className="text-xs font-medium">Credit Period</Label>
        <Select value={String(val)} onValueChange={(v) => onChange?.(Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder="Select credit period" />
          </SelectTrigger>
          <SelectContent>
            {OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

