'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function LeaveRequestAlerts({ pending }) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-fuchsia-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-fuchsia-800">
          Leave Request Alerts
          {pending?.length ? (
            <span className="ml-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-fuchsia-600 text-[10px] font-semibold text-white">
              {pending.length}
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-72 overflow-auto pr-1 text-xs">
        {(!pending || pending.length === 0) && (
          <p className="text-fuchsia-600/80">No pending leave requests.</p>
        )}
        {pending?.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between border-b border-fuchsia-100/70 pb-1 last:border-0"
          >
            <div>
              <div className="font-semibold text-slate-800">{req.staffName}</div>
              <div className="text-[11px] text-slate-600">
                {req.leaveType} • {req.startDate} → {req.endDate}
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="xs" variant="outline" className="h-6 border-emerald-500 text-[10px] px-2">
                Approve
              </Button>
              <Button size="xs" variant="outline" className="h-6 border-rose-500 text-[10px] px-2">
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

