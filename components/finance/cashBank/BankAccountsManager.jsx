'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'

export default function BankAccountsManager({ accounts, apiBase, onSaved }) {
  const [name, setName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [openingBalance, setOpeningBalance] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!apiBase || !name) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/cash-bank/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          type: 'BANK',
          accountNumber: accountNumber || undefined,
          ifsc: ifsc || undefined,
          openingBalance: openingBalance || 0,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to add bank')
      setName('')
      setAccountNumber('')
      setIfsc('')
      setOpeningBalance('')
      onSaved?.()
    } catch (e) {
      alert(e.message || 'Failed to add bank')
    } finally {
      setSaving(false)
    }
  }

  const bankAccounts = (accounts || []).filter((a) => a.type === 'BANK')

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-white">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm font-semibold text-gray-800">Bank Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <form className="space-y-2" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label>Name</Label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label>Account No</Label>
              <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label>IFSC / Code</Label>
              <input value={ifsc} onChange={(e) => setIfsc(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label>Opening Balance</Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <Button type="submit" disabled={saving} size="sm" className="mt-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Bank
          </Button>
        </form>

        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-gray-600 mb-1">Existing banks</p>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {bankAccounts.map((a) => (
              <li key={a.id} className="flex items-center justify-between text-xs text-gray-700">
                <span>
                  {a.name} {a.accountNumber ? `· ${a.accountNumber}` : ''}
                </span>
                <span className="font-semibold">${Number(a.currentBalance || a.openingBalance || 0).toFixed(2)}</span>
              </li>
            ))}
            {bankAccounts.length === 0 && <li className="text-xs text-gray-400">No bank accounts yet.</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
