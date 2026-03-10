'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AttendanceFilters({ filters, onChange }) {
  const v = filters || {}

  const update = (field, value) => {
    onChange?.({ ...v, [field]: value })
  }

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-indigo-50 border-sky-100 rounded-2xl">
      <CardContent className="pt-3 pb-3 grid gap-3 md:grid-cols-3 text-xs">
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-slate-700">Date</Label>
          <Input
            type="date"
            className="h-8 text-xs"
            value={v.date || ''}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-slate-700">Department</Label>
          <Select value={v.department || 'all'} onValueChange={(val) => update('department', val)}>
            <SelectTrigger className="h-8 text-xs">
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
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-slate-700">Shift</Label>
          <Select value={v.shift || 'all'} onValueChange={(val) => update('shift', val)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All shifts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

