'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import CombinedBillStats from './CombinedBillStats'
import GuestFolioSelector from './GuestFolioSelector'
import RoomChargesPanel from './RoomChargesPanel'
import RestaurantChargesPanel from './RestaurantChargesPanel'
import OtherChargesPanel from './OtherChargesPanel'
import TaxSummaryPanel from './TaxSummaryPanel'
import PaymentSettlementPanel from './PaymentSettlementPanel'
import FinalInvoicePreview from './FinalInvoicePreview'
import CheckoutConfirmationModal from './CheckoutConfirmationModal'
import {
  fetchGuestFolio,
  addOtherCharges,
  calculateFinalBill,
  applyAdvance,
  settleCombinedBill,
  generateFinalInvoice,
} from '@/services/api/combinedBillApi'
import { Button } from '@/components/ui/button'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CombinedBills() {
  const { user } = useAuth()
  const [folio, setFolio] = useState(null)
  const [otherCharges, setOtherCharges] = useState([])
  const [taxSummary, setTaxSummary] = useState(null)
  const [netPayable, setNetPayable] = useState(0)
  const [invoice, setInvoice] = useState(null)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
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

  const summary = useMemo(() => {
    if (!folio?.ledger) return {}
    return {
      roomTotal: Number(folio.ledger.roomChargesTotal || 0),
      restaurantTotal: Number(folio.ledger.restaurantChargesTotal || 0),
      otherTotal: Number(folio.ledger.otherChargesTotal || 0) + otherCharges.reduce((s, c) => s + Number(c.amount || 0), 0),
      advanceTotal: Number(folio.ledger.advanceTotal || 0),
      balance: Number(folio.ledger.balance || 0),
    }
  }, [folio, otherCharges])

  useEffect(() => {
    const recalc = async () => {
      if (!folio || !apiBase) return
      try {
        const payload = { folio }
        const res = await calculateFinalBill(apiBase, payload)
        setTaxSummary(res.tax)
        setNetPayable(res.netPayable)
      } catch (e) {
        console.error('calculate error:', e)
      }
    }
    recalc()
  }, [folio, apiBase])

  const handleSelectBooking = async (booking) => {
    if (!apiBase || !booking?.id) return
    setLoading(true)
    setError(null)
    setInvoice(null)
    try {
      const res = await fetchGuestFolio(apiBase, booking.id)
      setFolio(res.folio)
      setOtherCharges([])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddOtherCharges = async (list) => {
    setOtherCharges(list)
    if (!apiBase || !folio || !list.length) return
    try {
      await addOtherCharges(apiBase, {
        bookingId: folio.booking.id,
        guestId: folio.booking.guestId,
        items: list,
      })
      const res = await fetchGuestFolio(apiBase, folio.booking.id)
      setFolio(res.folio)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleApplyAdvance = async (amount) => {
    if (!apiBase || !folio) return
    try {
      await applyAdvance(apiBase, {
        bookingId: folio.booking.id,
        guestId: folio.booking.guestId,
        amount,
      })
      const res = await fetchGuestFolio(apiBase, folio.booking.id)
      setFolio(res.folio)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleSettle = async (payments) => {
    if (!apiBase || !folio) return
    setLoading(true)
    setError(null)
    try {
      const payload = {
        bookingId: folio.booking.id,
        guestId: folio.booking.guestId,
        guestName: folio.booking.guestName,
        payments: payments.map((p) => ({
          method: p.method,
          amount: Number(p.amount || 0),
        })),
      }
      const res = await settleCombinedBill(apiBase, payload)
      // Generate invoice payload after successful settlement
      const invoiceRes = await generateFinalInvoice(apiBase, {
        bookingId: folio.booking.id,
        folio,
        taxBreakdowns: [],
        payments: res.settlement.payments || [],
      })
      setInvoice(invoiceRes.invoice)
      setConfirmationOpen(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user?.hotelId) {
    return (
      <main className="p-4">
        <p className="text-slate-600 text-sm">Please log in and select a hotel to use Combined Bills.</p>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Combined Bills</h1>
          <p className="text-xs text-slate-500">
            Merge room, restaurant, and other charges into a unified checkout invoice.
          </p>
        </div>
        <Button variant="outline" size="sm" disabled={!folio} onClick={() => window.print()}>
          Print / Export
        </Button>
      </div>

      <CombinedBillStats summary={summary} />

      {error && (
        <div className="p-3 rounded-md bg-rose-50 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GuestFolioSelector onSelectFolio={handleSelectBooking} />

          {folio && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RoomChargesPanel booking={folio.booking} roomBill={folio.roomBill} ledger={folio.ledger} />
              <RestaurantChargesPanel restaurantBills={folio.restaurantBills} ledger={folio.ledger} />
            </div>
          )}

          {folio && (
            <OtherChargesPanel charges={otherCharges} onChange={handleAddOtherCharges} loading={loading} />
          )}
        </div>

        <div className="space-y-4 lg:col-span-1">
          {folio && (
            <>
              <TaxSummaryPanel tax={taxSummary} />
              <PaymentSettlementPanel netPayable={netPayable} onSettle={handleSettle} loading={loading} />
            </>
          )}
          <FinalInvoicePreview invoice={invoice} />
        </div>
      </div>

      <CheckoutConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        invoice={invoice}
      />
    </main>
  )
}

