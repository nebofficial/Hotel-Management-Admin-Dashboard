'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreditLimitSetup({ creditLimit, onChange }) {
  const value = creditLimit ?? ''

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-amber-700">Credit Limit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label className="text-xs font-medium">Credit Limit (₹)</Label>
        <Input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value || 0))}
          placeholder="500000"
        />
      </CardContent>
    </Card>
  )
}

