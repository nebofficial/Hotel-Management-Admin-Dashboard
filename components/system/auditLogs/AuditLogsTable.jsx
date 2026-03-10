'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AuditLogsTable({ logs = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200/80 bg-slate-50">
        <CardTitle className="text-sm font-semibold text-slate-800">Detailed Activity Logs</CardTitle>
        <p className="text-[11px] text-slate-500">
          Unified view of activities across modules for audit review.
        </p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : !logs.length ? (
          <p className="text-xs text-slate-500 py-8 text-center">No logs for selected filters</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200/80">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Timestamp</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">User</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Module</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Action</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 100).map((log, idx) => (
                <tr key={log.id || idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">
                    {log.createdAt || log.timestamp || log.loginTime || '-'}
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-800">{log.userName || '-'}</td>
                  <td className="py-2 px-3 text-slate-700">{log.module || log.type || '-'}</td>
                  <td className="py-2 px-3 text-slate-700">{log.action || log.status || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">
                    {log.description ||
                      (typeof log.details === 'string'
                        ? log.details
                        : log.details
                        ? JSON.stringify(log.details)
                        : '-')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

