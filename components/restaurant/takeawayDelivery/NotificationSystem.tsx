'use client'

import { useState } from 'react'
import type { TakeawayDeliveryOrder, TakeawayNotificationLog } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'

interface Props {
  orders: TakeawayDeliveryOrder[]
  notifications: TakeawayNotificationLog[]
  onSendLog: (payload: { channel: 'SMS' | 'WhatsApp'; orderId?: string; trackingId?: string; recipient?: string; message?: string; status?: string }) => Promise<unknown>
}

export default function NotificationSystem({ orders, notifications, onSendLog }: Props) {
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [channel, setChannel] = useState<'SMS' | 'WhatsApp'>('SMS')
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedOrder = orders.find((o) => o.id === selectedOrderId)

  const handleSend = async () => {
    if (!selectedOrder) return
    setSending(true)
    setError(null)
    try {
      await onSendLog({
        channel,
        orderId: selectedOrder.id,
        trackingId: selectedOrder.trackingId,
        recipient: recipient.trim() || selectedOrder.customerPhone || undefined,
        message: message.trim() || `Order ${selectedOrder.trackingId} status: ${selectedOrder.status}`,
        status: 'Sent',
      })
      setMessage('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to log')
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Notification System</CardTitle>
        <p className="text-xs text-slate-500">Send SMS / WhatsApp order updates (logged to backend).</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 max-w-md">
          <Label>Order</Label>
          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger><SelectValue placeholder="Choose order" /></SelectTrigger>
            <SelectContent>
              {orders.filter((o) => o.status !== 'Cancelled').map((o) => (
                <SelectItem key={o.id} value={o.id}>{o.trackingId} - {o.customerName || o.customerPhone || '-'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>Channel</Label>
          <Select value={channel} onValueChange={(v) => setChannel(v as 'SMS' | 'WhatsApp')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SMS">SMS</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          <Label>Recipient</Label>
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Phone" />
          <Label>Message</Label>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
          <Button onClick={handleSend} disabled={sending || !selectedOrderId}>{sending ? 'Sending' : 'Send and log'}</Button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Recent notifications</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Tracking ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Channel</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Recipient</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.slice(0, 20).map((n) => (
                  <tr key={n.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2">{n.trackingId || '-'}</td>
                    <td className="px-3 py-2"><Badge variant="outline">{n.channel}</Badge></td>
                    <td className="px-3 py-2">{n.recipient || '-'}</td>
                    <td className="px-3 py-2">{n.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {notifications.length === 0 && <p className="p-4 text-center text-slate-500 text-xs">No notifications yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
