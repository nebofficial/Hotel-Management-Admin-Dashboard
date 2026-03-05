'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import CashBookCard from './CashBookCard'
import BankBookCard from './BankBookCard'
import DepositWithdrawalPanel from './DepositWithdrawalPanel'
import DailyCashWidget from './DailyCashWidget'
import ReconciliationSection from './ReconciliationSection'
import BRSStatement from './BRSStatement'
import BankAccountsManager from './BankAccountsManager'
import CashBankExport from './CashBankExport'

export default function CashBankDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [accounts, setAccounts] = useState([])
  const [entries, setEntries] = useState([])
  const [selectedBankId, setSelectedBankId] = useState('')
  const [recon, setRecon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dailyCashRefresh, setDailyCashRefresh] = useState(0)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadAccounts = async () => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/cash-bank/accounts`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setAccounts(data.accounts || [])
    }
  }

  const loadEntriesAndRecon = async (accountId) => {
    if (!apiBase || !accountId) return
    const token = localStorage.getItem('token')
    const [entriesRes, reconRes] = await Promise.all([
      fetch(`${apiBase}/cash-bank/entries?accountId=${accountId}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${apiBase}/cash-bank/reconciliation?accountId=${accountId}`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
    if (entriesRes.ok) {
      const d = await entriesRes.json()
      setEntries(d.entries || [])
    }
    if (reconRes.ok) {
      const d = await reconRes.json()
      setRecon(d)
    }
  }

  useEffect(() => {
    if (!apiBase) return
    setLoading(true)
    loadAccounts().finally(() => setLoading(false))
  }, [apiBase])

  useEffect(() => {
    if (!selectedBankId && accounts.length) {
      const firstBank = accounts.find((a) => a.type === 'BANK')
      if (firstBank) setSelectedBankId(firstBank.id)
    }
  }, [accounts, selectedBankId])

  useEffect(() => {
    if (selectedBankId) {
      loadEntriesAndRecon(selectedBankId)
    }
  }, [selectedBankId])

  const cashAccount = accounts.find((a) => a.type === 'CASH') || null
  const selectedBank = accounts.find((a) => a.id === selectedBankId) || null

  const handleQuickAddCash = async (amt) => {
    if (!apiBase) {
      alert('Select a hotel first to use Cash Book.')
      return
    }
    if (!cashAccount?.id) {
      alert('No cash account is configured. Please add a cash account first.')
      return
    }
    try {
      const token = localStorage.getItem('token')
      const today = new Date().toISOString().slice(0, 10)
      const res = await fetch(`${apiBase}/cash-bank/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          accountId: cashAccount.id,
          date: today,
          type: 'DEPOSIT',
          amount: amt,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add cash entry')
      }
      await loadAccounts()
      setDailyCashRefresh((k) => k + 1)
    } catch (e) {
      alert(e.message || 'Failed to add cash entry')
    }
  }

  const handleMarkReconciled = async (ids) => {
    if (!apiBase || !ids?.length) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/cash-bank/reconciliation/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ entryIds: ids }),
    })
    if (res.ok && selectedBankId) {
      await loadEntriesAndRecon(selectedBankId)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in with a hotel account to view cash/bank dashboard.</p>
      </div>
    )
  }

  if (loading && !accounts.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading cash & bank data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-sky-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cash & Bank / BRS</h1>
          <p className="text-gray-600 mt-1">Manage cash book, bank balances, and reconciliation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CashBookCard cashAccount={cashAccount} onQuickAdd={handleQuickAddCash} />
        <BankBookCard accounts={accounts} selectedId={selectedBankId} onSelect={setSelectedBankId} />
        <DailyCashWidget apiBase={apiBase} refreshTrigger={dailyCashRefresh} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DepositWithdrawalPanel
          accounts={accounts}
          selectedAccountId={selectedBankId || cashAccount?.id}
          apiBase={apiBase}
          onSaved={() => {
            loadAccounts()
            if (selectedBankId) loadEntriesAndRecon(selectedBankId)
            setDailyCashRefresh((k) => k + 1)
          }}
        />
        <ReconciliationSection data={recon} onMarkReconciled={handleMarkReconciled} />
        <BRSStatement data={recon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BankAccountsManager accounts={accounts} apiBase={apiBase} onSaved={async () => { await loadAccounts(); }} />
        <CashBankExport account={selectedBank || cashAccount} entries={entries} />
      </div>
    </div>
  )
}
