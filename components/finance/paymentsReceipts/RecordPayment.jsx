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

export default function RecordPayment({ apiBase, onRecorded }) {
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('cash')
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!apiBase) return
    const errors = []
    if (!vendor) errors.push('Vendor is required')
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
      const today = new Date().toISOString().slice(0, 10)
      const res = await fetch(`${apiBase}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          category: 'Vendor Payment',
          amount: Number(amount),
          expenseDate: today,
          description: reference || `Payment to ${vendor}`,
          paymentMethod: mode,
          vendor,
          status: 'Paid',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to record payment')
      onRecorded?.({ type: 'payment', vendor, amount: Number(amount), mode, reference })
      setAmount('')
      setReference('')
    } catch (e) {
      alert(e.message || 'Failed to record payment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 to-red-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Record Payment (Outgoing)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <Label className="text-xs text-rose-50">Vendor</Label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Select / enter vendor"
              className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-rose-50">Amount</Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-900"
              />
            </div>
            <div>
              <Label className="text-xs text-rose-50">Payment Mode</Label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-900 bg-white"
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
            <Label className="text-xs text-rose-50">Reference / Transaction ID</Label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Optional reference or bank / UPI ID"
              className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-900"
            />
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="w-full mt-1 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white text-sm"
          >
            {saving ? 'Saving...' : 'Submit Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

