'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function GSTCompanyDetails({ value, onChange }) {
  const v = value || {}
  const update = (field, val) => onChange?.({ ...v, [field]: val })

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-violet-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-violet-700">GST / Tax Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs font-medium">GST Number</Label>
          <Input
            value={v.gstNumber || ''}
            onChange={(e) => update('gstNumber', e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">PAN</Label>
          <Input
            value={v.panNumber || ''}
            onChange={(e) => update('panNumber', e.target.value.toUpperCase())}
            placeholder="AAAAA0000A"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs font-medium">Tax Address</Label>
          <Input
            value={v.taxAddress || ''}
            onChange={(e) => update('taxAddress', e.target.value)}
            placeholder="Registered tax address"
          />
        </div>
      </CardContent>
    </Card>
  )
}

