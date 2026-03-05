'use client'

import type { TakeawayDeliveryOrder } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Smartphone } from 'lucide-react'

interface Props {
  orders: TakeawayDeliveryOrder[]
  onRefresh: () => void
}

export default function OnlineOrderIntegration({ orders, onRefresh }: Props) {
  const onlineOrders = orders.filter((o) => o.source === 'online')

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Online Order Integration
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Orders synced from website / app.</p>
        </div>
        <RefreshCw className="h-4 w-4 cursor-pointer text-slate-500 hover:text-slate-700" onClick={onRefresh} title="Refresh" />
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Tracking ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Type</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Payment</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {onlineOrders.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium">{o.trackingId}</td>
                  <td className="px-3 py-2"><Badge variant="outline">{o.orderType}</Badge></td>
                  <td className="px-3 py-2">{o.customerName || o.customerPhone || '—'}</td>
                  <td className="px-3 py-2">{o.status}</td>
                  <td className="px-3 py-2">{o.paymentStatus}</td>
                  <td className="px-3 py-2 text-right">₹{Number(o.totalAmount || 0).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {onlineOrders.length === 0 && (
            <p className="p-4 text-center text-slate-500 text-xs">No online orders yet. Sync with your website or app to see orders here.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
