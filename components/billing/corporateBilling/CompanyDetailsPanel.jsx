'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CompanyDetailsPanel({ value, onChange }) {
  const v = value || {}
  const update = (field, val) => {
    onChange?.({ ...v, [field]: val })
  }

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-blue-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-blue-700">Corporate Account Creation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Company Name</Label>
          <Input
            value={v.companyName || ''}
            onChange={(e) => update('companyName', e.target.value)}
            placeholder="ABC Technologies Pvt Ltd"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Contact Person</Label>
          <Input
            value={v.contactPerson || ''}
            onChange={(e) => update('contactPerson', e.target.value)}
            placeholder="Mr. John Doe"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Phone Number</Label>
          <Input
            value={v.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Email</Label>
          <Input
            type="email"
            value={v.email || ''}
            onChange={(e) => update('email', e.target.value)}
            placeholder="accounts@company.com"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs font-medium">Billing Address</Label>
          <Input
            value={v.billingAddress || ''}
            onChange={(e) => update('billingAddress', e.target.value)}
            placeholder="Full billing address"
          />
        </div>
      </CardContent>
    </Card>
  )
}

