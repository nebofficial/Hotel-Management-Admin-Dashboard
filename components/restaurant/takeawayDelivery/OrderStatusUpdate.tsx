'use client'

import type { TakeawayDeliveryOrder, TakeawayOrderStatus } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Truck } from 'lucide-react'

interface Props {
  orders: TakeawayDeliveryOrder[]
  onUpdateOrder: (id: string, patch: Partial<TakeawayDeliveryOrder>) => Promise<any>
}

const STATUS_OPTIONS: TakeawayOrderStatus[] = ['Placed', 'Packed', 'OutForDelivery', 'Delivered', 'Cancelled']

export default function OrderStatusUpdate({ orders, onUpdateOrder }: Props) {
  const handleStatusChange = async (orderId: string, status: TakeawayOrderStatus) => {
    try {
      await onUpdateOrder(orderId, { status })
    } catch (_) {}
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Order Status Update
        </CardTitle>
        <p className="text-xs text-slate-500">Update order status: Placed → Packed → Out for Delivery → Delivered.</p>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Tracking ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Type</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Current Status</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter((o) => o.status !== 'Cancelled').map((o) => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium">{o.trackingId}</td>
                  <td className="px-3 py-2">{o.orderType}</td>
                  <td className="px-3 py-2">{o.customerName || o.customerPhone || '—'}</td>
                  <td className="px-3 py-2">{o.status}</td>
                  <td className="px-3 py-2">
                    <Select value={o.status} onValueChange={(v) => handleStatusChange(o.id, v as TakeawayOrderStatus)}>
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.filter((s) => s !== 'Cancelled').map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.filter((o) => o.status !== 'Cancelled').length === 0 && (
            <p className="p-4 text-center text-slate-500 text-xs">No active orders.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
