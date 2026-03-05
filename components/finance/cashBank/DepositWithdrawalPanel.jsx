'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

const TYPES = [
  { value: 'DEPOSIT', label: 'Deposit' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'CHARGE', label: 'Charge' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
]

export default function DepositWithdrawalPanel({ accounts, selectedAccountId, apiBase, onSaved }) {
  const [type, setType] = useState('DEPOSIT')
  const [accountId, setAccountId] = useState(selectedAccountId || '')
  const [amount, setAmount] = useState('')
  const [referenceNo, setReferenceNo] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!apiBase || !accountId || !amount || Number(amount) <= 0) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const today = new Date().toISOString().slice(0, 10)
      const res = await fetch(`${apiBase}/cash-bank/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          accountId,
          date: today,
          type,
          amount: Number(amount),
          referenceNo: referenceNo || undefined,
          description: description || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to save entry')
      setAmount('')
      setReferenceNo('')
      setDescription('')
      onSaved?.()
    } catch (e) {
      alert(e.message || 'Failed to save entry')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-purple-900 text-base flex items-center gap-2">
          <ArrowDownCircle className="h-5 w-5" />
          Deposit / Withdrawal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <Label>Account</Label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select account</option>
              {(accounts || []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type === 'CASH' ? 'Cash' : a.name} {a.accountNumber ? `· ${a.accountNumber}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Amount</Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Reference No</Label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label>Description</Label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm">
            {saving ? <ArrowUpCircle className="h-4 w-4 animate-spin mr-1" /> : null}
            {saving ? 'Saving...' : 'Save Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
