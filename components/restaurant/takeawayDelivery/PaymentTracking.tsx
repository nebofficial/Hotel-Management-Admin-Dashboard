'use client'

import type { TakeawayDeliveryOrder } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DollarSign } from 'lucide-react'

interface Props {
  orders: TakeawayDeliveryOrder[]
  onUpdateOrder: (id: string, patch: Partial<TakeawayDeliveryOrder>) => Promise<unknown>
}

export default function PaymentTracking({ orders, onUpdateOrder }: Props) {
  const paid = orders.filter((o) => o.paymentStatus === 'Paid').length
  const pending = orders.filter((o) => o.paymentStatus === 'Pending').length
  const failed = orders.filter((o) => o.paymentStatus === 'Failed').length

  const handleStatusChange = async (orderId: string, paymentStatus: 'Paid' | 'Pending' | 'Failed') => {
    try {
      await onUpdateOrder(orderId, { paymentStatus })
    } catch (_) {
      // ignore
    }
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Payment Tracking
        </CardTitle>
        <p className="text-xs text-slate-500">Monitor payment status: Paid / Pending / Failed.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="text-xs text-green-700 font-medium">Paid</div>
              <div className="text-xl font-semibold text-green-800">{paid}</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3">
              <div className="text-xs text-amber-700 font-medium">Pending</div>
              <div className="text-xl font-semibold text-amber-800">{pending}</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3">
              <div className="text-xs text-red-700 font-medium">Failed</div>
              <div className="text-xl font-semibold text-red-800">{failed}</div>
            </CardContent>
          </Card>
        </div>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Tracking ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Amount</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium">{o.trackingId}</td>
                  <td className="px-3 py-2">{o.customerName || o.customerPhone || '—'}</td>
                  <td className="px-3 py-2">₹{Number(o.totalAmount || 0).toFixed(0)}</td>
                  <td className="px-3 py-2">
                    <Select
                      value={o.paymentStatus}
                      onValueChange={(v) => handleStatusChange(o.id, v as 'Paid' | 'Pending' | 'Failed')}
                    >
                      <SelectTrigger className="h-8 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="p-4 text-center text-slate-500 text-xs">No orders.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
