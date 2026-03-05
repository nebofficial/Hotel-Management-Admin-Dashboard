'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuditLogsPage() {
  const logs = [
    { id: 1, timestamp: '2024-01-20 15:30', user: 'John Smith', action: 'Created Reservation', module: 'Reservations', status: 'Success' },
    { id: 2, timestamp: '2024-01-20 14:45', user: 'Emma Davis', action: 'Updated Room Status', module: 'Rooms', status: 'Success' },
    { id: 3, timestamp: '2024-01-20 13:20', user: 'Michael Brown', action: 'Processed Payment', module: 'Billing', status: 'Success' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Audit Logs</h1>
          <p className="text-xs text-gray-500 mt-0.5">System activity and changes</p>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Timestamp</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">User</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Action</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Module</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-700">{log.timestamp}</td>
                      <td className="py-2 px-2 text-gray-900 font-medium">{log.user}</td>
                      <td className="py-2 px-2 text-gray-700">{log.action}</td>
                      <td className="py-2 px-2 text-gray-700">{log.module}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
