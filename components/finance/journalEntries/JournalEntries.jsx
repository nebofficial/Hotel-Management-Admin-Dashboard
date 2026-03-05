'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import CreateJournalEntry from './CreateJournalEntry'
import DoubleEntryValidation from './DoubleEntryValidation'
import LedgerPosting from './LedgerPosting'
import JournalReportExport from './JournalReportExport'

export default function JournalEntries() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [voucherNumber, setVoucherNumber] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [rows, setRows] = useState([{ accountId: '', accountName: '', debit: '', credit: '' }])
  const [narration, setNarration] = useState('')
  const [autoPost, setAutoPost] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recentEntries, setRecentEntries] = useState([])
  const [accounts, setAccounts] = useState([])

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const totals = useMemo(() => {
    let d = 0
    let c = 0
    rows.forEach((r) => {
      d += Number(r.debit || 0)
      c += Number(r.credit || 0)
    })
    return { totalDebit: d, totalCredit: c }
  }, [rows])

  const balanced = Math.abs(totals.totalDebit - totals.totalCredit) < 0.001 && totals.totalDebit > 0

  const loadVoucherNumber = async () => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/journal-entries/next-number`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.voucherNumber) setVoucherNumber(data.voucherNumber)
  }

  const loadRecent = async () => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/journal-entries?limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) setRecentEntries(data.entries || [])
  }

  const loadAccounts = async () => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/chart-of-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) setAccounts(data.accounts || [])
  }

  useEffect(() => {
    if (apiBase) {
      loadVoucherNumber()
      loadRecent()
      loadAccounts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  const handleRowChange = (idx, patch) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }

  const handleAddRow = () => {
    setRows((prev) => [...prev, { accountId: '', accountName: '', debit: '', credit: '' }])
  }

  const handleRemoveRow = (idx) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)))
  }

  const handleSave = async () => {
    if (!apiBase) return
    const lines = rows
      .filter((r) => r.accountId && (Number(r.debit || 0) > 0 || Number(r.credit || 0) > 0))
      .map((r) => ({
        accountId: r.accountId,
        accountName: r.accountName,
        debit: Number(r.debit || 0),
        credit: Number(r.credit || 0),
      }))
    if (!lines.length) {
      alert('Add at least one valid debit or credit line.')
      return
    }
    if (!balanced) {
      alert('Journal is not balanced. Please adjust debit and credit totals.')
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/journal-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          date,
          narration,
          autoPosted: autoPost,
          lines,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to save journal entry')
      alert(`Journal saved with voucher ${data.entry.voucherNumber}`)
      setRows([{ accountId: '', accountName: '', debit: '', credit: '' }])
      setNarration('')
      await loadVoucherNumber()
      await loadRecent()
    } catch (e) {
      alert(e.message || 'Failed to save journal entry')
    } finally {
      setSaving(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to manage journal entries.
        </p>
      </div>
    )
  }

  if (!accounts.length && !voucherNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading journal entries…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-sky-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
          <p className="text-gray-600 mt-1">
            Create double-entry journal vouchers and keep your ledger in balance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CreateJournalEntry
          voucherNumber={voucherNumber}
          date={date}
          onDateChange={setDate}
          rows={rows}
          onRowChange={handleRowChange}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          accounts={accounts}
          onSave={handleSave}
          saving={saving}
          narration={narration}
          onNarrationChange={setNarration}
          autoPost={autoPost}
          onToggleAutoPost={setAutoPost}
        />
        <DoubleEntryValidation
          totalDebit={totals.totalDebit}
          totalCredit={totals.totalCredit}
        />
        <div className="space-y-3">
          <LedgerPosting
            autoPost={autoPost}
            onToggle={setAutoPost}
            totalDebit={totals.totalDebit}
            totalCredit={totals.totalCredit}
          />
          <JournalReportExport entries={recentEntries} />
        </div>
      </div>
    </div>
  )
}

