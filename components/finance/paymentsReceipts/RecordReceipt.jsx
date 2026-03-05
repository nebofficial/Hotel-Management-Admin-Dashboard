'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
]

export default function RecordReceipt({ apiBase, onRecorded }) {
  const [guestName, setGuestName] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('cash')
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!apiBase) return
    const errors = []
    if (!guestName) errors.push('Guest name is required')
    if (!bookingId) errors.push('Booking / Invoice ID is required')
    if (!amount || Number(amount) <= 0) errors.push('Amount must be greater than 0')
    const needsRef = mode !== 'cash'
    if (needsRef && !reference) errors.push('Transaction / Reference ID is required for non-cash payments')
    if (errors.length) {
      alert(errors.join('\n'))
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      // Map UI mode to backend enum
      let backendMethod = mode
      if (mode === 'card') backendMethod = 'credit_card'
      if (mode === 'upi') backendMethod = 'other'
      const res = await fetch(`${apiBase}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bookingId,
          amount: Number(amount),
          paymentMethod: backendMethod,
          status: 'completed',
          transactionId: reference || undefined,
          guestId: bookingId,
          guestName,
          notes: 'Front office receipt',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to record receipt')
      onRecorded?.({ type: 'receipt', guestName, bookingId, amount: Number(amount), mode, reference })
      setAmount('')
      setReference('')
    } catch (e) {
      alert(e.message || 'Failed to record receipt')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-green-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Record Receipt (Incoming)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-emerald-50">Guest / Customer</Label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Guest name"
                className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
              />
            </div>
            <div>
              <Label className="text-xs text-emerald-50">Booking / Invoice ID</Label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Booking or invoice number"
                className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-emerald-50">Amount</Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
              />
            </div>
            <div>
              <Label className="text-xs text-emerald-50">Payment Mode</Label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 bg-white"
              >
                {MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-emerald-50">Reference / Transaction ID</Label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Optional reference or bank / UPI ID"
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="w-full mt-1 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 text-white text-sm"
          >
            {saving ? 'Saving...' : 'Submit Receipt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

