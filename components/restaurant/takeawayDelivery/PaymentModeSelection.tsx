'use client'

import type { TakeawayDeliveryOrder } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard } from 'lucide-react'

interface Props {
  orders: TakeawayDeliveryOrder[]
  onUpdateOrder: (id: string, patch: Partial<TakeawayDeliveryOrder>) => Promise<unknown>
}

export default function PaymentModeSelection({ orders, onUpdateOrder }: Props) {
  const handleModeChange = async (orderId: string, paymentMode: 'COD' | 'Online') => {
    try {
      await onUpdateOrder(orderId, { paymentMode })
    } catch (_) {
      // ignore
    }
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Mode Selection
        </CardTitle>
        <p className="text-xs text-slate-500">COD / Online payment per order.</p>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Tracking ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Amount</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium">{o.trackingId}</td>
                  <td className="px-3 py-2">{o.customerName || o.customerPhone || '—'}</td>
                  <td className="px-3 py-2">₹{Number(o.totalAmount || 0).toFixed(0)}</td>
                  <td className="px-3 py-2">
                    <Select value={o.paymentMode} onValueChange={(v) => handleModeChange(o.id, v as 'COD' | 'Online')}>
                      <SelectTrigger className="h-8 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COD">COD</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
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
