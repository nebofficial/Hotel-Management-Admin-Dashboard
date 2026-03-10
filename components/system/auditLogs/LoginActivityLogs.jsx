'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginActivityLogs({ logs = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-sky-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">User Login Activity</CardTitle>
        <p className="text-[11px] text-slate-500">Tracks system login events.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : !logs.length ? (
          <p className="text-xs text-slate-500 py-8 text-center">No login activity</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-sky-100/80 border-b border-sky-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">User Name</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Login Time</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">IP Address</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 50).map((log, i) => (
                <tr key={log.id || i} className="border-b border-slate-100 hover:bg-sky-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{log.userName || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{log.loginTime || log.createdAt}</td>
                  <td className="py-2 px-3 text-slate-600">{log.ipAddress || '-'}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700">
                      {log.status || 'Success'}
                    </span>
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

