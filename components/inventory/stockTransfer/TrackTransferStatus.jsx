'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Clock, CheckCircle2, XCircle } from 'lucide-react'

const statusConfig = {
  Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  Approved: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
  InTransit: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  Rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
}

export default function TrackTransferStatus({ transfer }) {
  if (!transfer) return null
  const config = statusConfig[transfer.status] || statusConfig.Pending
  const Icon = config.icon
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900 text-base">
          <Truck className="h-5 w-5" />
          Transfer Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`rounded-lg p-4 ${config.bg}`}>
          <div className="flex items-center gap-3">
            <Icon className={`h-8 w-8 ${config.color}`} />
            <div>
              <p className={`font-semibold ${config.color}`}>{transfer.status}</p>
              <p className="text-sm text-gray-600">{transfer.transferNumber}</p>
            </div>
          </div>
          {transfer.approvedAt && <p className="text-xs text-gray-500 mt-2">Approved: {new Date(transfer.approvedAt).toLocaleString()}</p>}
          {transfer.completedAt && <p className="text-xs text-gray-500 mt-1">Completed: {new Date(transfer.completedAt).toLocaleString()}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
