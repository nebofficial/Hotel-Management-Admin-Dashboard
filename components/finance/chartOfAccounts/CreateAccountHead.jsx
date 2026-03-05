'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Plus } from 'lucide-react'
import AccountTypeSelector from './AccountTypeSelector'
import AccountCodeGenerator from './AccountCodeGenerator'
import AccountStatusToggle from './AccountStatusToggle'
import OpeningBalanceSetup from './OpeningBalanceSetup'
import ParentSubAccounts from './ParentSubAccounts'

export default function CreateAccountHead({ accounts, apiBase, onCreated }) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [accountType, setAccountType] = useState('Asset')
  const [parentId, setParentId] = useState(null)
  const [openingBalance, setOpeningBalance] = useState(0)
  const [balanceType, setBalanceType] = useState('Debit')
  const [status, setStatus] = useState('Active')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!code.trim() || !name.trim()) {
      setError('Code and name are required.')
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/chart-of-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code: code.trim(),
          name: name.trim(),
          accountType,
          parentId: parentId || undefined,
          openingBalance,
          balanceType,
          status,
          description: description.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message || 'Failed to create account.')
        return
      }
      setCode('')
      setName('')
      setOpeningBalance(0)
      setBalanceType('Debit')
      setStatus('Active')
      setDescription('')
      onCreated?.(data.account)
    } catch (err) {
      setError(err.message || 'Failed to create account.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-900 text-base flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Account Head
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AccountCodeGenerator accountType={accountType} value={code} onChange={setCode} apiBase={apiBase} />
          <div>
            <Label className="text-gray-700">Account Name</Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cash in Hand"
              className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <AccountTypeSelector value={accountType} onChange={setAccountType} />
          <ParentSubAccounts accounts={accounts} parentId={parentId} onChange={setParentId} />
          <OpeningBalanceSetup
            amount={openingBalance}
            balanceType={balanceType}
            onAmountChange={setOpeningBalance}
            onBalanceTypeChange={setBalanceType}
            currency="USD"
          />
          <AccountStatusToggle value={status} onChange={setStatus} />
          <div>
            <Label className="text-gray-700">Description (optional)</Label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" rows={2} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
