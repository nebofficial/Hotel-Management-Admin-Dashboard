'use client'

import { useState } from 'react'
import type { TakeawayDeliveryOrder, TakeawayOrderItem } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Hash } from 'lucide-react'

interface Props {
  orders: TakeawayDeliveryOrder[]
  onCreateOrder: (payload: Partial<TakeawayDeliveryOrder>) => Promise<unknown>
}

export default function OrderTrackingID({ orders, onCreateOrder }: Props) {
  const [orderType, setOrderType] = useState<'Takeaway' | 'Delivery'>('Delivery')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemQty, setItemQty] = useState(1)
  const [itemPrice, setItemPrice] = useState('')
  const [items, setItems] = useState<TakeawayOrderItem[]>([])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addItem = () => {
    if (!itemName.trim() || !itemPrice) return
    const price = Number(itemPrice) || 0
    setItems((prev) => [...prev, { name: itemName.trim(), quantity: itemQty, price }])
    setItemName('')
    setItemQty(1)
    setItemPrice('')
  }

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleCreate = async () => {
    if (items.length === 0) {
      setError('Add at least one item')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0)
      await onCreateOrder({
        orderType,
        customerName: customerName.trim() || null,
        customerPhone: customerPhone.trim() || null,
        deliveryAddress: orderType === 'Delivery' ? deliveryAddress.trim() || null : null,
        pincode: orderType === 'Delivery' ? pincode.trim() || null : null,
        items,
        subtotal,
        totalAmount: subtotal,
        deliveryCharges: 0,
        paymentMode: 'COD',
        paymentStatus: 'Pending',
        status: 'Placed',
      })
      setCustomerName('')
      setCustomerPhone('')
      setDeliveryAddress('')
      setPincode('')
      setItems([])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create order')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Order Tracking ID
        </CardTitle>
        <p className="text-xs text-slate-500">Create order; unique tracking ID is generated automatically.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 max-w-md">
          <Label>Order type</Label>
          <Select value={orderType} onValueChange={(v) => setOrderType(v as 'Takeaway' | 'Delivery')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Takeaway">Takeaway</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Label>Customer name</Label>
          <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Name" />
          <Label>Customer phone</Label>
          <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone" />
          {orderType === 'Delivery' && (
            <>
              <Label>Delivery address</Label>
              <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Address" />
              <Label>Pincode</Label>
              <Input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" />
            </>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Items</h3>
          <div className="flex flex-wrap gap-2 items-end">
            <Input placeholder="Item name" value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-40" />
            <Input type="number" min={1} value={itemQty} onChange={(e) => setItemQty(Number(e.target.value) || 1)} className="w-16" />
            <Input placeholder="Price" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} className="w-24" />
            <Button size="sm" onClick={addItem}>Add</Button>
          </div>
          <ul className="mt-2 text-xs">
            {items.map((i, idx) => (
              <li key={idx} className="flex justify-between py-1">
                <span>{i.name} x{i.quantity} @ ₹{i.price} = ₹{i.quantity * i.price}</span>
                <Button variant="ghost" size="sm" className="h-6 text-red-600" onClick={() => removeItem(idx)}>Remove</Button>
              </li>
            ))}
          </ul>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button onClick={handleCreate} disabled={creating || items.length === 0}>{creating ? 'Creating…' : 'Create order (generate tracking ID)'}</Button>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Recent orders (tracking IDs)</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Tracking ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Customer</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 15).map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{o.trackingId}</td>
                    <td className="px-3 py-2">{o.orderType}</td>
                    <td className="px-3 py-2">{o.customerName || o.customerPhone || '—'}</td>
                    <td className="px-3 py-2 text-right">₹{Number(o.totalAmount || 0).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="p-4 text-center text-slate-500 text-xs">No orders yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
