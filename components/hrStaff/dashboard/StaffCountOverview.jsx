'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StaffCountOverview({ summary }) {
  const { totalStaff = 0, onDutyToday = 0, onLeaveToday = 0 } = summary || {}
  const offDuty = Math.max(totalStaff - onDutyToday - onLeaveToday, 0)

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-emerald-800">Staff Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-2xl font-semibold text-emerald-700">{totalStaff}</div>
          <div className="text-emerald-600/80">Total</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-sky-700">{onDutyToday}</div>
          <div className="text-sky-600/80">On Duty</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-amber-700">{offDuty}</div>
          <div className="text-amber-600/80">Off / Others</div>
        </div>
      </CardContent>
    </Card>
  )
}

