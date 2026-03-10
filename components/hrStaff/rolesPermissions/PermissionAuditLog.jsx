'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PermissionAuditLog({ logs }) {
  const list = logs || []

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-stone-50 border-amber-100 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-stone-900">Permission Audit Log</CardTitle>
      </CardHeader>
      <CardContent className="pt-1 max-h-64 overflow-auto pr-1 text-[11px] text-slate-700 space-y-1">
        {!list.length && <p className="text-slate-500">No recent permission changes.</p>}
        {list.map((log) => (
          <div key={log.id} className="border-b border-amber-100/70 pb-0.5 last:border-0">
            <div className="font-semibold text-slate-900">
              {log.adminName}{' '}
              <span className="text-[10px] font-normal text-slate-500">
                ({log.action})
              </span>
            </div>
            <div className="text-[10px] text-slate-600">
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

