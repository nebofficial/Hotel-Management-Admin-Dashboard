'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TableSelector({ tables = [], value, onChange, disabled }) {
  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-800">Table</h3>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((t) => (
              <SelectItem key={t.id} value={t.tableNo}>
                {t.tableNo} {t.status === 'Occupied' ? '(Occupied)' : ''}
              </SelectItem>
            ))}
            {tables.length === 0 && (
              <SelectItem value="T-01">T-01</SelectItem>
            )}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
