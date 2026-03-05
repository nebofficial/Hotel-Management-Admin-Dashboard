'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'

import ArrivalConfirmation from './ArrivalConfirmation'
import GuestVerificationPanel from './GuestVerificationPanel'
import RoomAssignmentPanel from './RoomAssignmentPanel'
import DepositCollectionPanel from './DepositCollectionPanel'
import DigitalSignaturePad from './DigitalSignaturePad'
import KeyCardActivationPanel from './KeyCardActivationPanel'
import CheckInActions from './CheckInActions'

import { getAllReservations } from '@/services/api/reservationApi'
import { fetchRooms } from '@/services/api/groupBookingApi'
import { confirmArrival, assignRoom, collectDeposit, activateStay } from '@/services/api/checkinApi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CheckInPage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [guestProfile, setGuestProfile] = useState(null)

  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState('')

  const [arrivalConfirming, setArrivalConfirming] = useState(false)
  const [arrivalConfirmed, setArrivalConfirmed] = useState(false)

  const [depositInfo, setDepositInfo] = useState({ amount: 0, mode: 'cash' })
  const [depositCollecting, setDepositCollecting] = useState(false)
  const [requiredDeposit, setRequiredDeposit] = useState(0)
  const [paidDeposit, setPaidDeposit] = useState(0)

  const [signature, setSignature] = useState(null)
  const [keyCard, setKeyCard] = useState({})
  const [activating, setActivating] = useState(false)

  useEffect(() => {
    let mounted = true
    async function init() {
      if (!apiBase) return
      try {
        const [roomsData] = await Promise.all([fetchRooms(apiBase).catch(() => ({ rooms: [] }))])
        if (!mounted) return
        setRooms(roomsData.rooms || [])
      } catch (e) {
        console.error('Check-in init error:', e)
      }
    }
    init()
    return () => {
      mounted = false
    }
  }, [apiBase])

  const handleSearchReservations = async (query) => {
    if (!apiBase) return
    setLoading(true)
    try {
      const data = await getAllReservations(apiBase, { search: query, status: 'confirmed' })
      setReservations(data.reservations || [])
    } catch (e) {
      console.error('Failed to search reservations:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectReservation = (r) => {
    setSelectedReservation(r)
    setGuestProfile({
      guestName: r.guestName,
      guestPhone: r.guestPhone,
      guestEmail: r.guestEmail,
    })
    setSelectedRoomId('')
    setRequiredDeposit(0)
    setPaidDeposit(Number(r.advancePaid || 0))
    setArrivalConfirmed(false)
  }

  const handleConfirmArrival = async (r) => {
    if (!apiBase || !r) return
    setArrivalConfirming(true)
    try {
      const res = await confirmArrival(apiBase, r.id)
      const stay = res.stay
      if (stay) {
        setRequiredDeposit(Number(stay.requiredDeposit || 0))
        setPaidDeposit(Number(stay.paidDeposit || 0))
      }
      setArrivalConfirmed(true)
      alert('Arrival confirmed. Proceed with verification and deposit.')
    } catch (e) {
      alert(e.message || 'Failed to confirm arrival')
    } finally {
      setArrivalConfirming(false)
    }
  }

  const handleAutoUpgrade = async () => {
    if (!apiBase || !selectedReservation) return
    try {
      const res = await assignRoom(apiBase, { bookingId: selectedReservation.id, upgradeRequested: true })
      const updated = res.booking
      setSelectedReservation(updated)
    } catch (e) {
      alert(e.message || 'Failed to upgrade room')
    }
  }

  const handleCollectDeposit = async (payload) => {
    if (!apiBase || !selectedReservation) return
    setDepositCollecting(true)
    try {
      const res = await collectDeposit(apiBase, {
        bookingId: selectedReservation.id,
        amount: payload.amount,
        mode: payload.mode,
      })
      const stay = res.stay
      if (stay) {
        setPaidDeposit(Number(stay.paidDeposit || 0))
      }
      alert('Deposit collected successfully.')
    } catch (e) {
      alert(e.message || 'Failed to collect deposit')
    } finally {
      setDepositCollecting(false)
    }
  }

  const handleActivateStay = async () => {
    if (!apiBase || !selectedReservation) return
    setActivating(true)
    try {
      const payload = {
        bookingId: selectedReservation.id,
        signatureImage: signature,
        keyCardNumber: keyCard.keyCardNumber,
      }
      const res = await activateStay(apiBase, payload)
      setSelectedReservation(res.booking)
      alert(`Guest checked in. Key card: ${res.keyCardNumber || 'encoded'}`)
    } catch (e) {
      alert(e.message || 'Failed to activate stay')
    } finally {
      setActivating(false)
    }
  }

  const canActivate = !!selectedReservation && !!signature && arrivalConfirmed

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to manage check-ins.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-violet-50/20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-in</h1>
          <p className="text-gray-600 mt-1">Search reservations, verify guest, and activate stays.</p>
        </div>
        {loading && <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-7 space-y-4">
          <ArrivalConfirmation
            onSearch={handleSearchReservations}
            reservations={reservations}
            selected={selectedReservation}
            onSelect={handleSelectReservation}
            onConfirm={handleConfirmArrival}
            confirming={arrivalConfirming}
          />

          <GuestVerificationPanel guest={guestProfile} onChange={setGuestProfile} />

          <RoomAssignmentPanel
            reservation={selectedReservation}
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onRoomChange={setSelectedRoomId}
            onUpgrade={handleAutoUpgrade}
            upgrading={false}
          />
        </div>

        <div className="xl:col-span-5 space-y-4">
          <DepositCollectionPanel
            required={requiredDeposit}
            paid={paidDeposit}
            value={depositInfo}
            onChange={setDepositInfo}
            onCollect={handleCollectDeposit}
            collecting={depositCollecting}
          />
          <DigitalSignaturePad value={signature} onChange={setSignature} />
          <KeyCardActivationPanel value={keyCard} onChange={setKeyCard} reservation={selectedReservation} />
          <CheckInActions canActivate={canActivate} activating={activating} onActivate={handleActivateStay} />
        </div>
      </div>
    </div>
  )
}

