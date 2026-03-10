'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function HRDashboardFilters({ filters, onChange }) {
  const v = filters || {}

  const update = (field, value) => {
    onChange?.({ ...v, [field]: value })
  }

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-rose-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-rose-800">Dashboard Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3 text-xs">
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">From</Label>
          <Input
            type="date"
            value={v.startDate || ''}
            onChange={(e) => update('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">To</Label>
          <Input
            type="date"
            value={v.endDate || ''}
            onChange={(e) => update('endDate', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium">Department</Label>
          <Select value={v.department || 'all'} onValueChange={(val) => update('department', val)}>
            <SelectTrigger>
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Front Office">Front Office</SelectItem>
              <SelectItem value="Housekeeping">Housekeeping</SelectItem>
              <SelectItem value="Kitchen">Kitchen</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

