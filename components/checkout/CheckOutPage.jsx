'use client'

import { useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'

import StaySummaryPanel from './StaySummaryPanel'
import PendingChargesPanel from './PendingChargesPanel'
import InvoicePreview from './InvoicePreview'
import PaymentSettlementPanel from './PaymentSettlementPanel'
import CheckOutActions from './CheckOutActions'

import { getAllReservations } from '@/services/api/reservationApi'
import {
  getStaySummary,
  generateFinalBill,
  addPendingCharge,
  processPayment,
  closeStay,
  sendInvoice,
} from '@/services/api/checkoutApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CheckOutPage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)

  const [booking, setBooking] = useState(null)
  const [stay, setStay] = useState(null)
  const [bill, setBill] = useState(null)
  const [extras, setExtras] = useState([])

  const [payments, setPayments] = useState([])
  const [processingPayment, setProcessingPayment] = useState(false)
  const [closing, setClosing] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!apiBase) return
    setLoading(true)
    try {
      const data = await getAllReservations(apiBase, { search, status: 'checked_in' })
      setReservations(data.reservations || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStay = async (bookingId) => {
    if (!apiBase || !bookingId) return
    try {
      const data = await getStaySummary(apiBase, bookingId)
      setBooking(data.booking)
      setStay(data.stay)
      setBill(data.bill)
      setExtras(data.bill?.extras || [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleSelectReservation = async (r) => {
    setSelectedReservation(r)
    await loadStay(r.id)
  }

  const handleGenerateBill = async () => {
    if (!apiBase || !selectedReservation) return
    try {
      const res = await generateFinalBill(apiBase, { bookingId: selectedReservation.id, extras })
      setBill(res.bill)
      setExtras(res.bill?.extras || [])
    } catch (e) {
      alert(e.message || 'Failed to generate final bill')
    }
  }

  const handleAddCharge = async (item) => {
    if (!apiBase || !selectedReservation) return
    try {
      const res = await addPendingCharge(apiBase, { bookingId: selectedReservation.id, item })
      setBill(res.bill)
      setExtras(res.bill?.extras || [])
    } catch (e) {
      alert(e.message || 'Failed to add pending charge')
    }
  }

  const handleProcessPayment = async () => {
    if (!apiBase || !selectedReservation || !bill) return
    setProcessingPayment(true)
    try {
      const res = await processPayment(apiBase, { bookingId: selectedReservation.id, payments })
      setBill(res.bill)
      alert('Payment processed successfully.')
    } catch (e) {
      alert(e.message || 'Failed to process payment')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleCloseStay = async () => {
    if (!apiBase || !selectedReservation) return
    setClosing(true)
    try {
      await closeStay(apiBase, { bookingId: selectedReservation.id })
      alert('Stay closed. Room set to available.')
      setSelectedReservation(null)
      setBooking(null)
      setStay(null)
      setBill(null)
      setExtras([])
      setPayments([])
    } catch (e) {
      alert(e.message || 'Failed to close stay')
    } finally {
      setClosing(false)
    }
  }

  const handleSendInvoice = async () => {
    if (!apiBase || !selectedReservation || !bill) return
    try {
      const res = await sendInvoice(apiBase, { bookingId: selectedReservation.id, billId: bill.id })
      alert(res?.message || 'Invoice sent successfully.')
    } catch (e) {
      alert(e.message || 'Failed to send invoice')
    }
  }

  const canClose = !!bill && bill.status === 'SETTLED'

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to manage check-outs.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-violet-50/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-out</h1>
          <p className="text-gray-600 mt-1">Generate final bills, settle payments, and close stays.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search checked-in guests…"
            className="h-9 w-60"
          />
          <Button type="submit" className="h-9">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 space-y-4">
          <StaySummaryPanel booking={booking} stay={stay} bill={bill} />

          <div className="bg-white rounded-xl shadow-sm border p-3 text-xs">
            <div className="font-semibold mb-2 text-gray-800">Select Guest</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {reservations.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectReservation(r)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-left ${
                    selectedReservation?.id === r.id
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{r.guestName}</div>
                    <div className="text-[11px] text-gray-500">
                      Room {r.roomNumber} • #{r.bookingNumber}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-gray-500">
                    {new Date(r.checkOut).toLocaleDateString('en-IN')}
                  </div>
                </button>
              ))}
              {!reservations.length && (
                <p className="text-[11px] text-gray-500 text-center py-2">
                  Search for guests with checked-in status to start check-out.
                </p>
              )}
            </div>
          </div>

          <PendingChargesPanel charges={extras} onAdd={handleAddCharge} onLocalChange={setExtras} />
        </div>

        <div className="xl:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 rounded-2xl p-3 text-white shadow-md">
            <div className="flex items-center justify-between mb-2 text-xs">
              <div>
                <div className="font-semibold text-sm">Final Bill</div>
                <div className="text-blue-100">Generate / refresh final invoice</div>
              </div>
              <Button
                type="button"
                size="sm"
                className="bg-white text-blue-700 hover:bg-blue-50 h-8 text-xs"
                onClick={handleGenerateBill}
                disabled={!selectedReservation}
              >
                Generate Bill
              </Button>
            </div>
            <InvoicePreview bill={bill} />
          </div>

          <PaymentSettlementPanel
            netPayable={bill?.netPayable || 0}
            onSetPayments={setPayments}
            processing={processingPayment}
          />

          <Button
            type="button"
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            disabled={!bill || processingPayment}
            onClick={handleProcessPayment}
          >
            {processingPayment ? 'Processing Payment…' : 'Process Payment'}
          </Button>

          <CheckOutActions
            canClose={canClose}
            closing={closing}
            onClose={handleCloseStay}
            onSendInvoice={handleSendInvoice}
          />
        </div>
      </div>
    </div>
  )
}

