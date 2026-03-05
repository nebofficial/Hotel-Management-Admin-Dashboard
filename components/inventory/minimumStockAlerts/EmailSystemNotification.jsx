'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react'

const statusColors = { Sent: 'bg-green-100 text-green-800', Failed: 'bg-red-100 text-red-800', Pending: 'bg-amber-100 text-amber-800' }
const statusIcons = { Sent: CheckCircle, Failed: XCircle, Pending: Clock }

export default function EmailSystemNotification({ notifications, items }) {
  const getItemName = (id) => items?.find((i) => i.id === id)?.name || id

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Mail className="h-5 w-5" />
          Notification History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {(notifications || []).length === 0 && <p className="text-center text-gray-500 py-6">No notifications sent yet</p>}
          {(notifications || []).map((n) => {
            const Icon = statusIcons[n.status] || Clock
            return (
              <div key={n.id} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{getItemName(n.itemId)}</p>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{n.channel}</span>
                      {n.recipient && <span className="text-xs text-gray-500">→ {n.recipient}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[n.status] || 'bg-gray-100'}`}>
                      <Icon className="h-3 w-3" /> {n.status}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt || n.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
