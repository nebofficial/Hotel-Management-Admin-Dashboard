'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2, Users } from 'lucide-react'
import GuestBillingRecords from './GuestBillingRecords'
import OutstandingDues from './OutstandingDues'
import AdvancePayments from './AdvancePayments'
import TransactionHistory from './TransactionHistory'
import RoomChargesPosting from './RoomChargesPosting'
import RestaurantChargesIntegration from './RestaurantChargesIntegration'
import PaymentAdjustment from './PaymentAdjustment'
import CreditLimitControl from './CreditLimitControl'
import GuestStatementPrint from './GuestStatementPrint'

export default function GuestLedger() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [list, setList] = useState([])
  const [outstanding, setOutstanding] = useState([])
  const [selected, setSelected] = useState(null)
  const [bookingDetail, setBookingDetail] = useState(null)
  const [guest, setGuest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadList = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const [listRes, outRes] = await Promise.all([
        fetch(`${apiBase}/guest-ledger`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBase}/guest-ledger/outstanding`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (listRes.ok) {
        const data = await listRes.json()
        setList(data.list || [])
      }
      if (outRes.ok) {
        const data = await outRes.json()
        setOutstanding(data.outstanding || [])
      }
    } catch (e) {
      console.error('Guest ledger load error', e)
    } finally {
      setLoading(false)
    }
  }

  const loadBookingDetail = async (booking) => {
    if (!apiBase || !booking?.id) return
    setLoadingDetail(true)
    try {
      const token = localStorage.getItem('token')
      const [detailRes, guestRes] = await Promise.all([
        fetch(`${apiBase}/guest-ledger/booking/${booking.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBase}/guests/${booking.guestId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (detailRes.ok) {
        const d = await detailRes.json()
        setBookingDetail(d)
      }
      if (guestRes.ok) {
        const g = await guestRes.json()
        setGuest(g.guest || g)
      }
    } catch (e) {
      console.error('Guest ledger detail error', e)
    } finally {
      setLoadingDetail(false)
    }
  }

  useEffect(() => {
    loadList()
  }, [effectiveHotelId])

  const handleSelect = (item) => {
    setSelected(item)
    setBookingDetail(null)
    setGuest(null)
    loadBookingDetail(item)
  }

  const advanceTotal = bookingDetail?.transactions
    ? bookingDetail.transactions.filter((t) => !t.isDebit && t.type === 'ADVANCE').reduce((s, t) => s + Number(t.amount || 0), 0)
    : 0

  const balance = bookingDetail?.balance ?? selected?.balance ?? 0

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Users className="h-14 w-14 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Select a hotel or log in with a hotel account to view the guest ledger.</p>
        </div>
      </div>
    )
  }

  if (loading && list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading guest ledger...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-sky-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guest Ledger</h1>
          <p className="text-gray-600 mt-1">Guest-wise billing, dues, and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <GuestBillingRecords list={list} onSelect={handleSelect} />
          <OutstandingDues outstanding={outstanding} onCollect={handleSelect} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdvancePayments selectedBooking={selected} advanceTotal={advanceTotal} balance={balance} />
            <RoomChargesPosting selectedBooking={selected} apiBase={apiBase} onPosted={() => { loadBookingDetail(selected); loadList(); }} />
            <RestaurantChargesIntegration selectedBooking={selected} apiBase={apiBase} onPosted={() => { loadBookingDetail(selected); loadList(); }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PaymentAdjustment selectedBooking={selected} apiBase={apiBase} onAdjusted={() => { loadBookingDetail(selected); loadList(); }} />
            <CreditLimitControl guest={guest} currentBalance={balance} apiBase={apiBase} onUpdated={() => loadBookingDetail(selected)} />
            <GuestStatementPrint
              booking={bookingDetail?.booking || selected}
              transactions={bookingDetail?.transactions || []}
              bookings={list}
              onSelectBooking={handleSelect}
            />
          </div>
          <TransactionHistory transactions={bookingDetail?.transactions || []} />
          {loadingDetail && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating ledger...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
