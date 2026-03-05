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

export default function AddExpenseEntry({ apiBase, onSaved }) {
  const [category, setCategory] = useState('')
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [mode, setMode] = useState('cash')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!apiBase) return
    const errors = []
    if (!category) errors.push('Category is required')
    if (!amount || Number(amount) <= 0) errors.push('Amount must be greater than 0')
    if (errors.length) {
      alert(errors.join('\n'))
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          expenseDate: date,
          vendor: vendor || null,
          paymentMethod: mode,
          status: 'Paid',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to save expense')
      onSaved?.(data.expense)
      setAmount('')
    } catch (e) {
      alert(e.message || 'Failed to save expense')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 to-orange-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Add Expense Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-rose-50">Category</Label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Utilities, Maintenance, Supplies…"
              className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-900"
            />
          </div>
          <div>
            <Label className="text-xs text-rose-50">Vendor</Label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Vendor name (optional)"
              className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-900"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
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
            <Label className="text-xs text-rose-50">Date</Label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white text-sm mt-1"
        >
          {saving ? 'Saving...' : 'Save Expense'}
        </Button>
      </CardContent>
    </Card>
  )
}

