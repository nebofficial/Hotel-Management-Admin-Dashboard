'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import RefundStats from './RefundStats'
import BillSelector from './BillSelector'
import RefundTypeSelector from './RefundTypeSelector'
import RefundDetailsForm from './RefundDetailsForm'
import RefundModeSelector from './RefundModeSelector'
import ApprovalWorkflowPanel from './ApprovalWorkflowPanel'
import RefundSummaryPreview from './RefundSummaryPreview'
import RefundReceipt from './RefundReceipt'
import RefundHistoryTable from './RefundHistoryTable'
import {
  fetchBillDetails,
  initiateRefund,
  approveRefund,
  processRefund,
  generateRefundReceipt,
} from '@/services/api/refundApi'
import { Button } from '@/components/ui/button'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Refunds() {
  const { user } = useAuth()
  const [bills, setBills] = useState([])
  const [selectedBill, setSelectedBill] = useState(null)
  const [refundType, setRefundType] = useState('partial')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [mode, setMode] = useState('cash')
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [approved, setApproved] = useState(false)
  const [currentRefund, setCurrentRefund] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({})
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

  const refundableMax = useMemo(() => {
    if (!selectedBill) return 0
    const paid = Number(selectedBill.paidAmount || 0)
    const refunded = Number(selectedBill.refundedAmount || 0)
    return paid - refunded
  }, [selectedBill])

  const handleSearchBills = async (params) => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchBillDetails(apiBase, params)
      setBills(res.bills || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInitiate = async () => {
    if (!apiBase || !selectedBill) return
    const amt = Number(amount || 0)
    if (!amt || Number.isNaN(amt)) return
    if (!reason.trim()) {
      setError('Reason is required for refund')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await initiateRefund(apiBase, {
        billId: selectedBill.id,
        bookingId: selectedBill.bookingId,
        amount: amt,
        fullCancellation: refundType === 'full',
      })
      setCurrentRefund(res.refund)
      setRequiresApproval(!!res.requiresApproval)
      setApproved(!res.requiresApproval)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async () => {
    if (!apiBase || !currentRefund) return
    setLoading(true)
    setError(null)
    try {
      const res = await approveRefund(apiBase, { refundId: currentRefund.id })
      setCurrentRefund(res.refund)
      setApproved(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProcess = async () => {
    if (!apiBase || !currentRefund || !approved) return
    setLoading(true)
    setError(null)
    try {
      await processRefund(apiBase, {
        refundId: currentRefund.id,
        method: mode,
        reason,
      })
      const receiptRes = await generateRefundReceipt(apiBase, {
        refundId: currentRefund.id,
      })
      setReceipt(receiptRes.receipt)
      // basic history: append this refund
      setHistory((prev) => [...prev, { ...currentRefund, method: mode, notes: reason }])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user?.hotelId) {
    return (
      <main className="p-4">
        <p className="text-slate-600 text-sm">Please log in with a hotel to manage refunds.</p>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Refunds</h1>
          <p className="text-xs text-slate-500">
            Process full and partial refunds with approval workflow and receipts.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          Print / Export
        </Button>
      </div>

      <RefundStats stats={stats} />

      {error && (
        <div className="p-3 rounded-md bg-rose-50 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <BillSelector bills={bills} onSearch={handleSearchBills} onSelect={setSelectedBill} />
          <RefundTypeSelector type={refundType} onChange={setRefundType} />
          <RefundDetailsForm
            amount={amount}
            onAmountChange={setAmount}
            reason={reason}
            onReasonChange={setReason}
            maxAmount={refundableMax}
          />
          <Button
            type="button"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading || !selectedBill}
            onClick={handleInitiate}
          >
            {loading ? 'Validating...' : 'Initiate Refund'}
          </Button>
          <RefundHistoryTable refunds={history} />
        </div>

        <div className="space-y-4 lg:col-span-1">
          <RefundModeSelector value={mode} onChange={setMode} />
          <ApprovalWorkflowPanel
            requiresApproval={requiresApproval}
            approved={approved}
            onRequestApproval={handleApproval}
          />
          <RefundSummaryPreview bill={selectedBill} refundAmount={amount} />
          <RefundReceipt receipt={receipt} />
        </div>
      </div>
    </main>
  )
}

