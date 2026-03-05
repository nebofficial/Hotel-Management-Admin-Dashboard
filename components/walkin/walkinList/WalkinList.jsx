'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import WalkinFilters from './WalkinFilters'
import WalkinTable from './WalkinTable'

import {
  listWalkins,
  checkoutWalkin,
  cancelWalkin,
  generateBill,
} from '@/services/api/walkinApi'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function WalkinList() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [loading, setLoading] = useState(true)
  const [walkins, setWalkins] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })

  const [checkoutModal, setCheckoutModal] = useState(null)
  const [cancelModal, setCancelModal] = useState(null)
  const [checkoutPayment, setCheckoutPayment] = useState(0)
  const [cancelReason, setCancelReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const fetchWalkins = useCallback(async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const data = await listWalkins(apiBase, {
        ...filters,
        page,
        limit: 20,
      })
      setWalkins(data.walkins || [])
      setTotal(data.total || 0)
    } catch (e) {
      console.error('Failed to fetch walk-ins:', e)
    } finally {
      setLoading(false)
    }
  }, [apiBase, filters, page])

  useEffect(() => {
    fetchWalkins()
  }, [fetchWalkins])

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })
    setPage(1)
  }

  const handleView = (w) => {
    // Could open a detail modal or navigate
    console.log('View:', w)
  }

  const handleCheckoutClick = (w) => {
    setCheckoutModal(w)
    setCheckoutPayment(Number(w.balanceAmount || 0))
  }

  const handleCheckoutConfirm = async () => {
    if (!checkoutModal) return
    setProcessing(true)
    try {
      await checkoutWalkin(apiBase, checkoutModal.id, {
        additionalPayment: checkoutPayment,
        paymentMode: 'cash',
      })
      setCheckoutModal(null)
      fetchWalkins()
    } catch (e) {
      alert(e.message || 'Failed to check out')
    } finally {
      setProcessing(false)
    }
  }

  const handleCancelClick = (w) => {
    setCancelModal(w)
    setCancelReason('')
  }

  const handleCancelConfirm = async () => {
    if (!cancelModal) return
    setProcessing(true)
    try {
      await cancelWalkin(apiBase, cancelModal.id, cancelReason)
      setCancelModal(null)
      fetchWalkins()
    } catch (e) {
      alert(e.message || 'Failed to cancel')
    } finally {
      setProcessing(false)
    }
  }

  const handlePrintBill = async (w) => {
    try {
      const data = await generateBill(apiBase, w.id)
      console.log('Bill data:', data.bill)
      // Could open a print dialog or show the bill
      alert(`Bill ${data.bill.billNumber} generated. Print functionality coming soon.`)
    } catch (e) {
      alert(e.message || 'Failed to generate bill')
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to view walk-in bookings.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/25 to-violet-50/25">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Walk-in List</h1>
          <p className="text-gray-600 mt-1">Manage all walk-in bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchWalkins} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/reservations/walkin/new-walkin">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Walk-in
            </Button>
          </Link>
        </div>
      </div>

      <WalkinFilters filters={filters} onChange={setFilters} onClear={handleClearFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <>
          <WalkinTable
            walkins={walkins}
            onView={handleView}
            onCheckout={handleCheckoutClick}
            onCancel={handleCancelClick}
            onPrintBill={handlePrintBill}
          />

          {total > 20 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!checkoutModal} onOpenChange={() => setCheckoutModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check Out Guest</DialogTitle>
            <DialogDescription>
              Check out {checkoutModal?.guestName} from Room {checkoutModal?.roomNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">₹{Number(checkoutModal?.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Already Paid:</span>
              <span className="font-medium">₹{Number(checkoutModal?.paidAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Balance Due:</span>
              <span className="font-medium text-amber-600">₹{Number(checkoutModal?.balanceAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <Label>Additional Payment Collected</Label>
              <Input
                type="number"
                min={0}
                value={checkoutPayment}
                onChange={(e) => setCheckoutPayment(Number(e.target.value || 0))}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleCheckoutConfirm} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Check Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelModal} onOpenChange={() => setCancelModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Walk-in</DialogTitle>
            <DialogDescription>
              Cancel booking for {cancelModal?.guestName} in Room {cancelModal?.roomNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Cancellation Reason</Label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModal(null)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
