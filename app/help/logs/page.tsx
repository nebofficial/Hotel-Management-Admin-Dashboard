'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function ActivityLogsPage() {
  const logs = [
    { id: 1, timestamp: '2024-01-20 16:45', action: 'System Login', user: 'John Smith', status: 'Success' },
    { id: 2, timestamp: '2024-01-20 16:30', action: 'Created Reservation', user: 'Emma Davis', status: 'Success' },
    { id: 3, timestamp: '2024-01-20 15:20', action: 'Updated Room Status', user: 'Michael Brown', status: 'Success' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Activity Logs</h1>
            <p className="text-xs text-gray-500 mt-0.5">System activity and user actions</p>
          </div>
          <Button variant="outline" className="h-8 text-xs gap-1.5 bg-transparent">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Timestamp</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Action</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">User</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-700">{log.timestamp}</td>
                      <td className="py-2 px-2 text-gray-900 font-medium">{log.action}</td>
                      <td className="py-2 px-2 text-gray-700">{log.user}</td>
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
