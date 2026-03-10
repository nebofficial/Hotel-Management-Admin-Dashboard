'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AttendanceRatePanel({ today }) {
  const rate = today?.rate || 0
  const present = today?.present || 0
  const total = today?.totalScheduled || 0

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-amber-800">Attendance Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-xs">
        <div>
          <div className="text-2xl font-semibold text-amber-700">{rate.toFixed(1)}%</div>
          <div className="text-amber-700/80">
            {present}/{total || '–'} Present
          </div>
        </div>
        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-yellow-200 shadow-inner">
          <div className="absolute inset-1 rounded-full bg-white/80 flex items-center justify-center text-[11px] font-semibold text-amber-700">
            {rate.toFixed(0)}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

