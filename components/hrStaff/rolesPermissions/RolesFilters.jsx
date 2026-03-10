'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const MODULES = ['All Modules', 'Front Office', 'Reservations', 'Housekeeping', 'Billing', 'Restaurant', 'Finance', 'HR']

export function RolesFilters({ filters, onChange }) {
  const v = filters || {}

  const update = (field, value) => {
    onChange?.({ ...v, [field]: value })
  }

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-indigo-50 border-sky-100 rounded-2xl">
      <CardContent className="pt-3 pb-3 grid gap-3 md:grid-cols-3 text-xs">
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-slate-700">Module</Label>
          <Select
            value={v.module || 'All Modules'}
            onValueChange={(val) => update('module', val)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODULES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

