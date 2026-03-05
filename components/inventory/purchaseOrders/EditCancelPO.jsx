'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Pencil } from 'lucide-react'
import AutoPONumberGeneration from './AutoPONumberGeneration'
import SupplierSelection from './SupplierSelection'
import ExpectedDeliveryDate from './ExpectedDeliveryDate'
import AddMultipleItemsPO from './AddMultipleItemsPO'
import TaxCalculation from './TaxCalculation'

export default function EditCancelPO({ order, suppliers = [], inventoryItems = [], onUpdate, saving }) {
  const [supplierId, setSupplierId] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(null)
  const [items, setItems] = useState([])
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (order?.id) {
      setSupplierId(order.supplierId || '')
      setOrderDate(order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : '')
      setExpectedDeliveryDate(order.expectedDeliveryDate || null)
      setItems(Array.isArray(order.items) ? order.items : [])
      setTaxRate(Number(order.taxRate || 0))
      setNotes(order.notes || '')
    }
  }, [order?.id])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0),
    [items]
  )

  const canSubmit = useMemo(() => Boolean(order?.id) && Boolean(supplierId) && items.length > 0, [order?.id, supplierId, items.length])
  const canEdit = order?.status === 'Draft' || order?.status === 'Pending'

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit || !canEdit) return
    await onUpdate?.(order.id, {
      supplierId,
      orderDate: new Date(orderDate).toISOString(),
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate).toISOString() : null,
      items,
      taxRate,
      notes: notes.trim() || null,
    })
  }

  if (!order?.id) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <Pencil className="h-5 w-5 text-violet-600" />
            Edit Purchase Order
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-slate-500">Select a purchase order to edit.</p>
        </CardContent>
      </Card>
    )
  }

  if (!canEdit) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <Pencil className="h-5 w-5 text-violet-600" />
            Edit Purchase Order
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-slate-500">
            This order cannot be edited. Status: {order.status}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <Pencil className="h-5 w-5 text-violet-600" />
          Edit Purchase Order
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={submit} className="space-y-4">
          <AutoPONumberGeneration orderNumber={order.orderNumber} readOnly />

          <SupplierSelection suppliers={suppliers} value={supplierId} onChange={setSupplierId} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Order Date</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                required
              />
            </div>
            <ExpectedDeliveryDate value={expectedDeliveryDate} onChange={setExpectedDeliveryDate} />
          </div>

          <AddMultipleItemsPO items={items} inventoryItems={inventoryItems} onChange={setItems} />

          <TaxCalculation subtotal={subtotal} taxRate={taxRate} onTaxRateChange={setTaxRate} />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes…"
              className="min-h-[60px]"
            />
          </div>

          <Button type="submit" disabled={!canSubmit || saving} className="w-full bg-violet-600 hover:bg-violet-700">
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
