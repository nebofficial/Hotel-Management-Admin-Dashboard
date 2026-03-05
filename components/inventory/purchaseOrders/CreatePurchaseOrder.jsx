'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'
import AutoPONumberGeneration from './AutoPONumberGeneration'
import SupplierSelection from './SupplierSelection'
import ExpectedDeliveryDate from './ExpectedDeliveryDate'
import AddMultipleItemsPO from './AddMultipleItemsPO'
import TaxCalculation from './TaxCalculation'

export default function CreatePurchaseOrder({ suppliers = [], inventoryItems = [], onCreate, creating }) {
  const [supplierId, setSupplierId] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(null)
  const [items, setItems] = useState([])
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0),
    [items]
  )

  const canSubmit = useMemo(() => Boolean(supplierId) && items.length > 0, [supplierId, items.length])

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    await onCreate?.({
      supplierId,
      orderDate: new Date(orderDate).toISOString(),
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate).toISOString() : null,
      items,
      taxRate,
      notes: notes.trim() || null,
      status: 'Draft',
    })
    setSupplierId('')
    setOrderDate(new Date().toISOString().split('T')[0])
    setExpectedDeliveryDate(null)
    setItems([])
    setTaxRate(0)
    setNotes('')
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <PlusCircle className="h-5 w-5 text-blue-600" />
          Create Purchase Order
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={submit} className="space-y-4">
          <AutoPONumberGeneration orderNumber="" readOnly />

          <SupplierSelection suppliers={suppliers} value={supplierId} onChange={setSupplierId} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Order Date</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
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

          <Button type="submit" disabled={!canSubmit || creating} className="w-full bg-blue-600 hover:bg-blue-700">
            {creating ? 'Creating…' : 'Create Purchase Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
