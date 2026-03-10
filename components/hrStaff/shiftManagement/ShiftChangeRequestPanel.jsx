'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ShiftChangeRequestPanel({ requests, loading, onApprove, onReject }) {
  const pending = (requests || []).filter((r) => r.status === 'pending')

  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-100 to-orange-100">
        <CardTitle className="text-sm font-semibold text-slate-900">Shift Change Requests</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && <div className="py-4 text-center text-xs text-slate-500">Loading...</div>}
        {!loading && pending.length === 0 && <div className="py-4 text-center text-xs text-slate-500">No pending requests</div>}
        {!loading && pending.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pending.map((r) => (
              <div key={r.id} className="p-2 rounded-lg bg-white border border-amber-200 text-[11px]">
                <div className="font-medium">{r.staffName}</div>
                <div className="text-slate-600">{r.currentShiftName} to {r.requestedShiftName} on {r.requestedDate}</div>
                <div className="flex gap-1 mt-1">
                  <Button type="button" size="sm" className="h-6 text-[10px] bg-emerald-600" onClick={() => onApprove?.(r.id)}>Approve</Button>
                  <Button type="button" size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => onReject?.(r.id)}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
