'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RolePermissionLogs({ logs = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-red-400/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Role &amp; Permission Changes</CardTitle>
        <p className="text-[11px] text-slate-600">Tracks access control updates (roles, permissions).</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : !logs.length ? (
          <p className="text-xs text-slate-500 py-8 text-center">No role / permission changes</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-100/80 border-b border-orange-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">User Name</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Action</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Details</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 100).map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-orange-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{log.userName}</td>
                  <td className="py-2 px-3 text-slate-700">{log.action}</td>
                  <td className="py-2 px-3 text-slate-600">
                    {typeof log.details === 'string'
                      ? log.details
                      : log.details
                      ? JSON.stringify(log.details)
                      : '-'}
                  </td>
                  <td className="py-2 px-3 text-slate-600">{log.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

