'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentHRActivities({ pendingLeaves, dutyList }) {
  const events = []

  ;(pendingLeaves || []).slice(0, 5).forEach((req) => {
    events.push({
      id: `leave-${req.id}`,
      label: `${req.staffName} requested ${req.leaveType} leave`,
      meta: `${req.startDate} → ${req.endDate}`,
    })
  })

  ;(dutyList || []).slice(0, 5).forEach((s) => {
    events.push({
      id: `duty-${s.id}`,
      label: `${s.staffName} (${s.shift}) marked ${s.status}`,
      meta: s.department || s.role,
    })
  })

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-slate-50 border-indigo-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-indigo-800">Recent HR Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-60 overflow-auto pr-1 text-xs">
        {events.length === 0 && <p className="text-indigo-700/80">No recent HR events to show.</p>}
        {events.map((e) => (
          <div key={e.id} className="flex flex-col border-l-2 border-indigo-300 pl-2">
            <span className="font-semibold text-slate-800">{e.label}</span>
            <span className="text-[11px] text-slate-600">{e.meta}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

