'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchRoomBills, fetchBookingDetails, settleBill } from '@/services/api/roomBillApi'
import CreateRoomBill from './CreateRoomBill'
import RoomCharges from './RoomCharges'
import ExtraServices from './ExtraServices'
import DiscountSection from './DiscountSection'
import TaxCalculation from './TaxCalculation'
import SettlementPanel from './SettlementPanel'
import RefundAdjustment from './RefundAdjustment'
import InvoicePreview from './InvoicePreview'

function round2(n) {
  return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100
}

function sumExtras(extras) {
  const rows = Array.isArray(extras) ? extras : []
  return round2(
    rows.reduce((s, x) => {
      const qty = Number(x.qty || 0)
      const rate = Number(x.rate || 0)
      const amount = x.amount != null ? Number(x.amount) : qty * rate
      return s + (Number.isFinite(amount) ? amount : 0)
    }, 0),
  )
}

function computeTotals(state) {
  const nights = Math.max(1, parseInt(state.nights || 1, 10))
  const pricePerNight = Number(state.pricePerNight || 0)
  const lateCheckoutCharge = Number(state.lateCheckoutCharge || 0)
  const extraBedCharge = Number(state.extraBedCharge || 0)

  const roomSubtotal = round2(pricePerNight * nights + lateCheckoutCharge + extraBedCharge)
  const extrasSubtotal = round2(sumExtras(state.extras))
  const subtotal = round2(roomSubtotal + extrasSubtotal)

  const discountAmount = Math.max(0, Number(state.discountAmount || 0))
  const discountPercent = Math.max(0, Number(state.discountPercent || 0))
  const discountFromPercent = round2((subtotal * discountPercent) / 100)
  const discountTotal = round2(Math.min(subtotal, discountAmount + discountFromPercent))

  const applyBeforeTax = state.applyBeforeTax !== false
  const taxableAmount = round2(Math.max(0, subtotal - (applyBeforeTax ? discountTotal : 0)))
  const gstPercent = Math.max(0, Number(state.gstPercent || 0))
  const taxTotal = round2((taxableAmount * gstPercent) / 100)
  const cgst = round2(taxTotal / 2)
  const sgst = round2(taxTotal - cgst)
  const igst = 0

  const serviceChargeEnabled = !!state.serviceChargeEnabled
  const serviceChargePercent = Math.max(0, Number(state.serviceChargePercent || 0))
  const serviceChargeAmount = serviceChargeEnabled
    ? round2((taxableAmount * serviceChargePercent) / 100)
    : 0

  const grandTotal = round2(
    taxableAmount +
      taxTotal +
      serviceChargeAmount +
      (!applyBeforeTax ? -discountTotal : 0),
  )

  const advancePaid = Math.max(0, Number(state.advancePaid || 0))
  const advanceAdjusted = round2(Math.min(advancePaid, grandTotal))
  const netPayable = round2(Math.max(0, grandTotal - advanceAdjusted))

  return {
    nights,
    roomSubtotal,
    extrasSubtotal,
    subtotal,
    discountTotal,
    taxableAmount,
    cgst,
    sgst,
    igst,
    taxTotal,
    serviceChargeAmount,
    grandTotal,
    advancePaid,
    advanceAdjusted,
    netPayable,
  }
}

export default function RoomBills() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [selectedBookingId, setSelectedBookingId] = useState('')
  const [guest, setGuest] = useState(null)
  const [booking, setBooking] = useState(null)
  const [recentBills, setRecentBills] = useState([])

  const [state, setState] = useState({
    nights: 1,
    pricePerNight: 0,
    lateCheckoutCharge: 0,
    extraBedCharge: 0,
    extras: [],
    discountAmount: 0,
    discountPercent: 0,
    applyBeforeTax: true,
    gstPercent: 12,
    serviceChargeEnabled: true,
    serviceChargePercent: 5,
    advancePaid: 0,
    refundAmount: 0,
    refundReason: '',
  })

  const [payments, setPayments] = useState([])
  const totals = useMemo(() => computeTotals(state), [state])

  const apiBase = effectiveHotelId
    ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}`
    : ''

  useEffect(() => {
    const loadInitial = async () => {
      if (!apiBase) return
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        // 1) Try guest-ledger outstanding (bookings with balance)
        const res = await fetch(`${apiBase}/guest-ledger/outstanding`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && Array.isArray(data.outstanding) && data.outstanding.length > 0) {
          setBookings(data.outstanding.map((b) => ({ ...b, __source: 'booking' })))
        } else {
          // 2) Fallback: load all bookings so dropdown is not empty
          const resAll = await fetch(`${apiBase}/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const dataAll = await resAll.json().catch(() => ({}))
          if (resAll.ok && Array.isArray(dataAll.bookings) && dataAll.bookings.length > 0) {
            setBookings(dataAll.bookings.map((b) => ({ ...b, __source: 'booking' })))
          } else {
            // 3) Final fallback: show plain rooms so user can still pick a room
            const resRooms = await fetch(`${apiBase}/rooms`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            const dataRooms = await resRooms.json().catch(() => ({}))
            if (resRooms.ok && Array.isArray(dataRooms.rooms)) {
              setBookings(dataRooms.rooms.map((r) => ({ ...r, __source: 'room' })))
            } else {
              console.error('Room Bills bookings/rooms load error:', dataAll || dataRooms)
            }
          }
        }
        const rb = await fetchRoomBills(apiBase).catch(() => ({ list: [] }))
        setRecentBills(rb.list || [])
      } finally {
        setLoading(false)
      }
    }
    if (apiBase) loadInitial()
  }, [apiBase])

  const handleSelectBooking = async (bookingId) => {
    setSelectedBookingId(bookingId)
    if (!bookingId || !apiBase) return
    const selected = bookings.find((b) => b.id === bookingId)
    // If this comes from rooms (no booking entry), allow manual bill creation without auto-fetch
    if (selected && selected.__source === 'room') {
      const today = new Date()
      const ci = today.toISOString().slice(0, 10)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const co = tomorrow.toISOString().slice(0, 10)

      setBooking({
        roomNumber: selected.roomNumber,
        checkIn: ci,
        checkOut: co,
        guestName: '',
        bookingNumber: '',
      })
      setGuest(null)
      setState((prev) => ({
        ...prev,
        nights: 1,
        pricePerNight: Number(selected.pricePerNight || selected.defaultPricePerNight || 0),
        advancePaid: 0,
      }))
      setPayments([])
      return
    }
    try {
      // Pre-fill from selected booking so UI reacts instantly
      if (selected && selected.__source === 'booking') {
        setBooking({
          ...selected,
          checkIn: selected.checkIn || (selected.checkInDate || ''),
          checkOut: selected.checkOut || (selected.checkOutDate || ''),
        })
        setGuest(
          selected.guestName
            ? {
                fullName: selected.guestName,
              }
            : null,
        )
        const ci = selected.checkIn ? new Date(selected.checkIn) : null
        const co = selected.checkOut ? new Date(selected.checkOut) : null
        const nightsPrefill =
          ci && co
            ? Math.max(
                1,
                Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24)),
              )
            : 1
        const baseNightPrefill =
          nightsPrefill > 0 ? Number(selected.totalAmount || 0) / nightsPrefill : 0
        setState((prev) => ({
          ...prev,
          nights: nightsPrefill,
          pricePerNight: round2(baseNightPrefill),
        }))
      }

      const data = await fetchBookingDetails(apiBase, bookingId)
      setBooking(data.booking || null)
      const g = data.guest
      setGuest(
        g
          ? {
              ...g,
              fullName: [g.firstName, g.lastName].filter(Boolean).join(' '),
            }
          : null,
      )
      const nights = (() => {
        const ci = data.booking?.checkIn ? new Date(data.booking.checkIn) : null
        const co = data.booking?.checkOut ? new Date(data.booking.checkOut) : null
        if (!ci || !co) return 1
        const diffMs = co.getTime() - ci.getTime()
        return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)))
      })()
      const baseNight =
        nights > 0 ? Number(data.booking?.totalAmount || 0) / nights : 0

      setState((prev) => ({
        ...prev,
        nights,
        pricePerNight: round2(baseNight),
        advancePaid: Number(data.advancePaid || 0),
      }))
      setPayments([])
    } catch (e) {
      alert(e.message || 'Failed to load booking details')
    }
  }

  const handleDiscountChange = (patch) => {
    setState((prev) => ({
      ...prev,
      discountAmount: patch.discountAmount ?? prev.discountAmount,
      discountPercent: patch.discountPercent ?? prev.discountPercent,
      applyBeforeTax:
        patch.applyBeforeTax !== undefined ? patch.applyBeforeTax : prev.applyBeforeTax,
    }))
  }

  const handleTaxChange = (patch) => {
    setState((prev) => ({
      ...prev,
      gstPercent: patch.gstPercent ?? prev.gstPercent,
      serviceChargeEnabled:
        patch.serviceChargeEnabled !== undefined
          ? patch.serviceChargeEnabled
          : prev.serviceChargeEnabled,
      serviceChargePercent:
        patch.serviceChargePercent !== undefined
          ? patch.serviceChargePercent
          : prev.serviceChargePercent,
    }))
  }

  const handleRefundChange = (patch) => {
    setState((prev) => ({
      ...prev,
      refundAmount: patch.refundAmount ?? prev.refundAmount,
      refundReason: patch.refundReason ?? prev.refundReason,
    }))
  }

  const handleSettle = async () => {
    if (!apiBase || !booking || !guest) return
    try {
      const payload = {
        bookingId: booking.id,
        guestId: booking.guestId,
        guestName: booking.guestName,
        payments,
        createInvoice: false,
        subtotal: totals.subtotal,
        taxAmount: totals.taxTotal,
        items: state.extras,
      }
      const res = await settleBill(apiBase, payload)
      alert('Room bill settled successfully.')
      const rb = await fetchRoomBills(apiBase).catch(() => ({ list: [] }))
      setRecentBills(rb.list || [])
    } catch (e) {
      alert(e.message || 'Failed to settle bill')
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to manage Room Bills.
        </p>
      </div>
    )
  }

  if (loading && !booking && recentBills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading Room Bills…</p>
      </div>
    )
  }

  const currentBill = {
    ...booking,
    ...state,
    billNumber: booking?.billNumber,
    ...totals,
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-amber-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Bills</h1>
          <p className="text-gray-600 mt-1">
            Create and settle detailed room bills with extras, discounts, GST and split payments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-4">
          <CreateRoomBill
            bookings={bookings}
            selectedBookingId={selectedBookingId}
            onSelectBooking={handleSelectBooking}
            guest={guest}
            booking={booking}
            nights={state.nights}
            advancePaid={state.advancePaid}
            onAdvancePaidChange={(v) =>
              setState((prev) => ({
                ...prev,
                advancePaid: v,
              }))
            }
            onGuestNameChange={(name) =>
              setBooking((prev) => ({
                ...(prev || {}),
                guestName: name,
              }))
            }
            onBookingNumberChange={(num) =>
              setBooking((prev) => ({
                ...(prev || {}),
                bookingNumber: num,
              }))
            }
            onCheckInChange={(ci) =>
              setBooking((prev) => ({
                ...(prev || {}),
                checkIn: ci,
              }))
            }
            onCheckOutChange={(co) =>
              setBooking((prev) => ({
                ...(prev || {}),
                checkOut: co,
              }))
            }
            onRoomNumberChange={(roomNo) =>
              setBooking((prev) => ({
                ...(prev || {}),
                roomNumber: roomNo,
              }))
            }
            onNightsChange={(n) =>
              setState((prev) => ({
                ...prev,
                nights: Math.max(1, n),
              }))
            }
          />
          <RoomCharges
            pricePerNight={state.pricePerNight}
            nights={totals.nights}
            roomSubtotal={totals.roomSubtotal}
            lateCheckoutCharge={state.lateCheckoutCharge}
            extraBedCharge={state.extraBedCharge}
            onLateCheckoutChange={(v) => setState((prev) => ({ ...prev, lateCheckoutCharge: v }))}
            onExtraBedChange={(v) => setState((prev) => ({ ...prev, extraBedCharge: v }))}
          />
          <ExtraServices
            extras={state.extras}
            onChange={(next) => setState((prev) => ({ ...prev, extras: next }))}
          />
        </div>

        <div className="space-y-4">
          <DiscountSection
            subtotal={totals.subtotal}
            discountAmount={state.discountAmount}
            discountPercent={state.discountPercent}
            applyBeforeTax={state.applyBeforeTax}
            onChange={handleDiscountChange}
          />
          <TaxCalculation
            taxableBase={totals.taxableAmount}
            gstPercent={state.gstPercent}
            serviceChargeEnabled={state.serviceChargeEnabled}
            serviceChargePercent={state.serviceChargePercent}
            cgst={totals.cgst}
            sgst={totals.sgst}
            igst={totals.igst}
            taxTotal={totals.taxTotal}
            serviceChargeAmount={totals.serviceChargeAmount}
            onChange={handleTaxChange}
          />
          <SettlementPanel
            grandTotal={totals.grandTotal}
            advancePaid={totals.advancePaid}
            advanceAdjusted={totals.advanceAdjusted}
            netPayable={totals.netPayable}
            payments={payments}
            onPaymentsChange={setPayments}
            onSettle={handleSettle}
          />
          <RefundAdjustment
            refundAmount={state.refundAmount}
            refundReason={state.refundReason}
            onChange={handleRefundChange}
          />
        </div>

        <div className="space-y-4">
          <InvoicePreview bill={currentBill} hotel={hotel} />

          <Card className="border-0 shadow-md rounded-2xl">
            <CardContent className="p-3 space-y-2 text-xs">
              <div className="font-semibold text-gray-900 mb-1">Recent Room Bills</div>
              {recentBills.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {b.billNumber || b.id.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Room {b.roomNumber} • {b.guestName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{Number(b.grandTotal || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-[11px] text-gray-500">{b.status}</div>
                  </div>
                </div>
              ))}
              {recentBills.length === 0 && (
                <p className="text-gray-500 text-xs">No room bills created yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

