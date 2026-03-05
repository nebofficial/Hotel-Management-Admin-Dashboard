'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import CreditNoteStats from './CreditNoteStats'
import InvoiceSelector from './InvoiceSelector'
import CreditAmountPanel from './CreditAmountPanel'
import CreditUsagePanel from './CreditUsagePanel'
import OutstandingCreditTable from './OutstandingCreditTable'
import CreditExpiryTracker from './CreditExpiryTracker'
import CreditNotePreview from './CreditNotePreview'
import CreditNotePrint from './CreditNotePrint'
import {
  fetchInvoiceDetails,
  createCreditNote,
  applyCredit,
  fetchOutstandingCredits,
  trackCreditExpiry,
  generateCreditNotePDF,
} from '@/services/api/creditNoteApi'
import { Button } from '@/components/ui/button'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CreditNotes() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [currentCredit, setCurrentCredit] = useState(null)
  const [outstanding, setOutstanding] = useState({ list: [], summary: {} })
  const [expiryInfo, setExpiryInfo] = useState({ items: [], expiringSoon: [], expired: [] })
  const [pdfPayload, setPdfPayload] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(() => {
    if (!user?.hotelId) return ''
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const base =
      host !== 'localhost' && host !== '127.0.0.1'
        ? `http://${host}:5000`
        : API_BASE
    return `${base}/api/hotel-data/${user.hotelId}`
  }, [user?.hotelId])

  const loadOutstanding = async () => {
    if (!apiBase) return
    try {
      const res = await fetchOutstandingCredits(apiBase)
      setOutstanding({ list: res.list || [], summary: res.summary || {} })
      const expiry = await trackCreditExpiry(apiBase)
      setExpiryInfo(expiry)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    loadOutstanding()
  }, [apiBase])

  const handleSearchInvoices = async (params) => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchInvoiceDetails(apiBase, params)
      setInvoices(res.invoices || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCredit = async () => {
    if (!apiBase || !selectedInvoice) return
    const amt = Number(amount || 0)
    if (!amt || Number.isNaN(amt)) return
    setLoading(true)
    setError(null)
    try {
      const res = await createCreditNote(apiBase, {
        invoiceId: selectedInvoice.id,
        amount: amt,
        reason,
      })
      setCurrentCredit(res.creditNote)
      await loadOutstanding()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePdf = async () => {
    if (!apiBase || !currentCredit) return
    try {
      const res = await generateCreditNotePDF(apiBase, { creditNoteId: currentCredit.id })
      setPdfPayload(res.creditNote)
    } catch (e) {
      setError(e.message)
    }
  }

  if (!user?.hotelId) {
    return (
      <main className="p-4">
        <p className="text-slate-600 text-sm">Please log in with a hotel to manage credit notes.</p>
      </main>
    )
  }

  const stats = {
    totalIssued: outstanding.summary?.totalIssued || 0,
    outstandingBalance: outstanding.summary?.balance || 0,
    usedThisMonth: 0, // placeholder; can be computed from history later
  }

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Credit Notes</h1>
          <p className="text-xs text-slate-500">
            Issue, track, and apply credit notes against invoices and checkouts.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Print / Export
        </Button>
      </div>

      <CreditNoteStats stats={stats} expiryInfo={expiryInfo} />

      {error && (
        <div className="p-3 rounded-md bg-rose-50 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <InvoiceSelector invoices={invoices} onSearch={handleSearchInvoices} onSelect={setSelectedInvoice} />
          <CreditAmountPanel
            invoice={selectedInvoice}
            amount={amount}
            onAmountChange={setAmount}
            reason={reason}
            onReasonChange={setReason}
          />
          <Button
            type="button"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading || !selectedInvoice}
            onClick={handleCreateCredit}
          >
            {loading ? 'Creating...' : 'Generate Credit Note'}
          </Button>
          <OutstandingCreditTable credits={expiryInfo.items || []} />
        </div>

        <div className="space-y-4 lg:col-span-1">
          <CreditExpiryTracker expiringSoon={expiryInfo.expiringSoon} expired={expiryInfo.expired} />
          <CreditUsagePanel creditNote={currentCredit} onApply={() => {}} />
          <CreditNotePreview creditNote={currentCredit} invoice={selectedInvoice} />
          <Button
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
            disabled={!currentCredit}
            onClick={handleGeneratePdf}
          >
            Generate Printable Credit Note
          </Button>
          <CreditNotePrint payload={pdfPayload} />
        </div>
      </div>
    </main>
  )
}

