'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Clock, Package, XCircle, FileText, Truck } from 'lucide-react'

const STATUS_CONFIG = {
  Draft: { color: 'from-slate-500 to-slate-600', icon: FileText, label: 'Draft' },
  Pending: { color: 'from-yellow-500 to-orange-600', icon: Clock, label: 'Pending Approval' },
  Approved: { color: 'from-blue-500 to-blue-600', icon: CheckCircle2, label: 'Approved' },
  Ordered: { color: 'from-indigo-500 to-purple-600', icon: Package, label: 'Ordered' },
  Received: { color: 'from-green-500 to-emerald-600', icon: Truck, label: 'Received' },
  Cancelled: { color: 'from-red-500 to-red-600', icon: XCircle, label: 'Cancelled' },
}

export default function POStatusTracking({ status, orderNumber, approvedAt, expectedDeliveryDate }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Draft
  const Icon = config.icon

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${config.color} text-white`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm font-medium mb-1">Status</p>
            <p className="text-3xl font-bold">{config.label}</p>
            {orderNumber && (
              <p className="text-white/80 text-xs mt-1 font-mono">{orderNumber}</p>
            )}
            {approvedAt && (
              <p className="text-white/70 text-xs mt-2">
                Approved: {new Date(approvedAt).toLocaleDateString()}
              </p>
            )}
            {expectedDeliveryDate && status !== 'Received' && (
              <p className="text-white/70 text-xs mt-1">
                Expected: {new Date(expectedDeliveryDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <Icon className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
