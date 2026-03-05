'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import AdvanceStats from './AdvanceStats'
import BookingSelector from './BookingSelector'
import CollectAdvancePanel from './CollectAdvancePanel'
import BalanceAdvanceTracker from './BalanceAdvanceTracker'
import RefundAdvanceModal from './RefundAdvanceModal'
import ApprovalModal from './ApprovalModal'
import AdvanceHistoryTable from './AdvanceHistoryTable'
import AdvanceReceiptPreview from './AdvanceReceiptPreview'
import {
  getAdvanceHistory,
  collectAdvance,
  adjustAdvance,
  refundAdvance,
} from '@/services/api/advancePaymentApi'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AdvancePayments() {
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [history, setHistory] = useState([])
  const [summary, setSummary] = useState({})
  const [selectedAdvance, setSelectedAdvance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refundModalOpen, setRefundModalOpen] = useState(false)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [pendingRefundPayload, setPendingRefundPayload] = useState(null)
  const [approvalMessage, setApprovalMessage] = useState('')

  const apiBase = useMemo(() => {
    if (!user?.hotelId) return ''
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const base =
      host !== 'localhost' && host !== '127.0.0.1'
        ? `http://${host}:5000`
        : API_BASE
    return `${base}/api/hotel-data/${user.hotelId}`
  }, [user?.hotelId])

  const loadHistory = async (bookingId, guestId) => {
    if (!apiBase || !bookingId) return
    try {
      const res = await getAdvanceHistory(apiBase, { bookingId, guestId })
      setHistory(res.list || [])
      setSummary(res.summary || {})
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    if (booking) {
      loadHistory(booking.id, booking.guestId)
    }
  }, [booking])

  const handleCollect = async (payload) => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const res = await collectAdvance(apiBase, payload)
      setSelectedAdvance(res.advance)
      await loadHistory(res.booking.id, res.booking.guestId)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefundClick = () => {
    if (!selectedAdvance) return
    setRefundModalOpen(true)
  }

  const handleRefundSubmit = async ({ amount, mode, reason }) => {
    if (!apiBase || !selectedAdvance) return
    setLoading(true)
    setError(null)
    try {
      const payload = {
        receiptNumber: selectedAdvance.receiptNumber,
        amount,
        mode,
        reason,
      }
      // First attempt refund – it may ask for approval
      try {
        await refundAdvance(apiBase, payload)
      } catch (e) {
        const data = (() => {
          try {
            return JSON.parse(e.message)
          } catch {
            return null
          }
        })()
        if (e.message?.includes('requires manager approval') || data?.requiresApproval) {
          setPendingRefundPayload(payload)
          setApprovalMessage(e.message || 'Manager approval required for this refund.')
          setApprovalModalOpen(true)
          return
        }
        throw e
      }
      await loadHistory(booking.id, booking.guestId)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefundModalOpen(false)
    }
  }

  const handleApprovalConfirm = async ({ managerApproved }) => {
    if (!apiBase || !pendingRefundPayload || !selectedAdvance) return
    setLoading(true)
    setError(null)
    try {
      await refundAdvance(apiBase, {
        ...pendingRefundPayload,
        managerApproved,
      })
      await loadHistory(booking.id, booking.guestId)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setApprovalModalOpen(false)
      setPendingRefundPayload(null)
    }
  }

  if (!user?.hotelId) {
    return (
      <main className="p-4">
        <p className="text-slate-600 text-sm">Please log in with a hotel to manage advance payments.</p>
      </main>
    )
  }

  const latestReceipt = history.length > 0 ? history[0].receiptNumber : null

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Advance Payments</h1>
          <p className="text-xs text-slate-500">
            Collect, adjust, and refund guest advance payments with full visibility.
          </p>
        </div>
      </div>

      <AdvanceStats summary={summary} />

      {error && (
        <div className="p-3 rounded-md bg-rose-50 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <BookingSelector onSelect={setBooking} />
          <CollectAdvancePanel
            booking={booking}
            onCollect={handleCollect}
            loading={loading}
            lastReceipt={latestReceipt}
          />
          <AdvanceHistoryTable advances={history} onSelectReceipt={setSelectedAdvance} />
        </div>

        <div className="space-y-4 lg:col-span-1">
          <BalanceAdvanceTracker summary={summary} />
          <AdvanceReceiptPreview advance={selectedAdvance} booking={booking} />
          {selectedAdvance && (
            <button
              type="button"
              onClick={handleRefundClick}
              className="w-full rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium py-2 shadow-sm hover:from-orange-600 hover:to-red-600"
            >
              Refund Advance
            </button>
          )}
        </div>
      </div>

      <RefundAdvanceModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        onSubmit={handleRefundSubmit}
        maxAmount={
          selectedAdvance
            ? Number(selectedAdvance.amount || 0) -
              Number(selectedAdvance.adjustedAmount || 0) -
              Number(selectedAdvance.refundedAmount || 0)
            : 0
        }
        loading={loading}
      />

      <ApprovalModal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        message={approvalMessage}
        onApprove={handleApprovalConfirm}
        loading={loading}
      />
    </main>
  )
}

