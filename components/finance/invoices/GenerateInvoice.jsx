'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import AutoInvoiceNumber from './AutoInvoiceNumber'
import TaxCalculation from './TaxCalculation'

export default function GenerateInvoice({ apiBase, onCreated }) {
  const [guestName, setGuestName] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [taxPercent, setTaxPercent] = useState(18)
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }])
  const [saving, setSaving] = useState(false)

  const subtotal = items.reduce(
    (s, it) => s + Number(it.quantity || 0) * Number(it.price || 0),
    0
  )
  const taxAmount = (subtotal * Number(taxPercent || 0)) / 100
  const totalAmount = subtotal + taxAmount

  const updateItem = (idx, patch) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }

  const addRow = () => setItems((prev) => [...prev, { description: '', quantity: 1, price: 0 }])
  const removeRow = (idx) =>
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)))

  const handleSave = async () => {
    if (!apiBase) return
    const errors = []
    if (!guestName) errors.push('Guest / Customer is required')
    if (!items.some((it) => it.description && Number(it.quantity || 0) > 0)) {
      errors.push('At least one line item with description and quantity > 0 is required')
    }
    if (errors.length) {
      alert(errors.join('\n'))
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          invoiceNumber,
          bookingId: bookingId || null,
          guestName,
          issueDate,
          subtotal,
          taxAmount,
          totalAmount,
          taxPercent,
          items,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to create invoice')
      onCreated?.(data.invoice)
      alert('Invoice generated.')
    } catch (e) {
      alert(e.message || 'Failed to create invoice')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-green-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Generate Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-emerald-50">Guest / Customer</Label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
          <div>
            <Label className="text-xs text-emerald-50">Booking / Reference</Label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AutoInvoiceNumber apiBase={apiBase} value={invoiceNumber} onChange={setInvoiceNumber} />
          <div>
            <Label className="text-xs text-emerald-50">Issue Date</Label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-2 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-100">
            <span>Items</span>
            <button
              type="button"
              onClick={addRow}
              className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[11px]"
            >
              + Add Row
            </button>
          </div>
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-6">
                <input
                  type="text"
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) => updateItem(idx, { description: e.target.value })}
                  className="w-full rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-900"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, { quantity: Number(e.target.value || 0) })}
                  className="w-full rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-900"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={it.price}
                  onChange={(e) => updateItem(idx, { price: Number(e.target.value || 0) })}
                  className="w-full rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-900"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="text-[11px] text-emerald-50 px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <TaxCalculation subtotal={subtotal} taxPercent={taxPercent} onChange={setTaxPercent} />

        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full bg-white text-emerald-700 hover:bg-emerald-50 text-sm mt-1"
        >
          {saving ? 'Saving...' : 'Generate Invoice'}
        </Button>
      </CardContent>
    </Card>
  )
}

