'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'

export default function DateFilter({ startDate, endDate, onStartChange, onEndChange }) {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 rounded-2xl shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-indigo-900 text-base">
          <Calendar className="h-5 w-5" />
          Date Range Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-700 text-sm">Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => onStartChange(e.target.value)} className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label className="text-gray-700 text-sm">End Date</Label>
            <Input type="date" value={endDate} onChange={(e) => onEndChange(e.target.value)} className="mt-1 rounded-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
