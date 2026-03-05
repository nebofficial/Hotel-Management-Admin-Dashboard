'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'

import ReservationForm from './ReservationForm'
import RoomTypeSelector from './RoomTypeSelector'
import AvailabilityChecker from './AvailabilityChecker'
import RoomAssignment from './RoomAssignment'
import GuestDetailsForm from './GuestDetailsForm'
import RatePlanSelector from './RatePlanSelector'
import SpecialRequests from './SpecialRequests'
import ExtraServices from './ExtraServices'
import PaymentCollection from './PaymentCollection'
import ConfirmationActions from './ConfirmationActions'

import { checkAvailability, createReservation, fetchNextReservationNumber, pricingQuote } from '@/services/api/reservationApi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function NewReservation() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [reservationNumber, setReservationNumber] = useState('')

  const [stay, setStay] = useState({
    checkIn: new Date().toISOString().slice(0, 10),
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    numberOfGuests: 1,
    roomType: '',
    roomId: '',
  })

  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idType: 'national_id',
    idNumber: '',
    address: { line1: '', line2: '', city: '', state: '', country: '', zip: '' },
  })

  const [ratePlan, setRatePlan] = useState('standard')
  const [specialRequests, setSpecialRequests] = useState('')

  const [extras, setExtras] = useState({
    breakfast: false,
    airportPickup: false,
    extraBed: false,
    customAddOns: [],
  })

  const [payment, setPayment] = useState({
    advancePaid: 0,
    mode: 'cash',
  })

  const [availability, setAvailability] = useState({
    availableCount: null,
    availableRooms: [],
    lastChecked: null,
  })

  const [quote, setQuote] = useState(null)
  const debounceRef = useRef(null)

  const canAutoRefresh = useMemo(() => {
    return Boolean(stay.checkIn && stay.checkOut && stay.roomType)
  }, [stay.checkIn, stay.checkOut, stay.roomType])

  const refreshAvailability = async (opts = {}) => {
    if (!apiBase || !stay.checkIn || !stay.checkOut) return
    try {
      const json = await checkAvailability(apiBase, {
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        roomType: (opts.roomType ?? stay.roomType) || undefined,
      })
      setAvailability({
        availableCount: json.availableCount,
        availableRooms: json.availableRooms || [],
        lastChecked: new Date().toISOString(),
      })
    } catch (e) {
      setAvailability((prev) => ({ ...prev, availableCount: null, availableRooms: [] }))
    }
  }

  const refreshQuote = async () => {
    if (!apiBase || !stay.checkIn || !stay.checkOut) return
    try {
      const json = await pricingQuote(apiBase, {
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        guests: stay.numberOfGuests,
        roomId: stay.roomId || undefined,
        roomType: stay.roomType || undefined,
        ratePlan,
        extras,
      })
      setQuote(json)
    } catch (e) {
      setQuote(null)
    }
  }

  useEffect(() => {
    let mounted = true

    async function init() {
      if (!apiBase) return
      setLoading(true)
      try {
        const next = await fetchNextReservationNumber(apiBase)
        if (mounted) setReservationNumber(next || '')
      } catch (e) {
        if (mounted) setReservationNumber('')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => {
      mounted = false
    }
  }, [apiBase])

  useEffect(() => {
    if (!canAutoRefresh) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      await refreshAvailability()
      await refreshQuote()
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stay.checkIn, stay.checkOut, stay.numberOfGuests, stay.roomType, stay.roomId, ratePlan, extras])

  const roomTypes = useMemo(() => {
    const set = new Set((availability.availableRooms || []).map((r) => r.roomType).filter(Boolean))
    return Array.from(set).sort()
  }, [availability.availableRooms])

  const onCreate = async (confirm) => {
    if (!apiBase) return
    setSubmitting(true)
    try {
      const payload = {
        bookingNumber: reservationNumber || undefined,
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        numberOfGuests: stay.numberOfGuests,
        roomType: stay.roomType || undefined,
        roomId: stay.roomId || undefined,
        ratePlan,
        specialRequests,
        extras,
        guest,
        payment,
        confirm: Boolean(confirm),
      }
      const res = await createReservation(apiBase, payload)
      alert(
        confirm
          ? `Reservation Confirmed: ${res?.booking?.bookingNumber || 'Created'}`
          : `Saved as Tentative: ${res?.booking?.bookingNumber || 'Created'}`
      )

      const next = await fetchNextReservationNumber(apiBase).catch(() => '')
      setReservationNumber(next || '')
      setStay((s) => ({ ...s, roomId: '' }))
      await refreshAvailability()
      await refreshQuote()
    } catch (e) {
      alert(e?.message || 'Failed to create reservation')
    } finally {
      setSubmitting(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to create a reservation.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-gray-600">Preparing New Reservation…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Reservation</h1>
          <p className="text-gray-600 mt-1">Create, price, collect advance, and confirm in one flow</p>
        </div>
        <div className="rounded-xl border bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
          <div className="text-xs text-gray-500">Auto Reservation Number</div>
          <div className="text-lg font-semibold tracking-tight text-gray-900">{reservationNumber || '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <ReservationForm
            reservationNumber={reservationNumber}
            onReservationNumberChange={setReservationNumber}
            stay={stay}
            onChange={setStay}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoomTypeSelector
              value={stay.roomType}
              onChange={(roomType) => setStay((s) => ({ ...s, roomType, roomId: '' }))}
              roomTypes={roomTypes}
              hint="⚡ Auto updates on date change"
            />
            <AvailabilityChecker
              stay={stay}
              availability={availability}
              onCheck={refreshAvailability}
            />
          </div>

          <RoomAssignment
            stay={stay}
            onAssign={(roomId) => setStay((s) => ({ ...s, roomId }))}
            availability={availability}
          />

          <GuestDetailsForm guest={guest} onChange={setGuest} hint="Auto-save guest profile if existing." />

          <RatePlanSelector value={ratePlan} onChange={setRatePlan} quote={quote} />

          <SpecialRequests value={specialRequests} onChange={setSpecialRequests} />

          <ExtraServices value={extras} onChange={setExtras} quote={quote} />
        </div>

        <div className="xl:col-span-5 space-y-6">
          <PaymentCollection payment={payment} onChange={setPayment} quote={quote} />
          <ConfirmationActions
            submitting={submitting}
            quote={quote}
            stay={stay}
            guest={guest}
            onConfirm={() => onCreate(true)}
            onTentative={() => onCreate(false)}
          />

          <div className="rounded-2xl border bg-white/70 backdrop-blur p-5 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">Live Summary</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-500">Guests</div>
              <div className="text-right font-medium">{stay.numberOfGuests}</div>
              <div className="text-gray-500">Room Type</div>
              <div className="text-right font-medium">{stay.roomType || '—'}</div>
              <div className="text-gray-500">Room</div>
              <div className="text-right font-medium">
                {stay.roomId ? availability.availableRooms.find((r) => String(r.id) === String(stay.roomId))?.roomNumber || 'Selected' : 'Optional'}
              </div>
              <div className="text-gray-500">Total</div>
              <div className="text-right font-semibold">{quote ? quote.total : '—'}</div>
              <div className="text-gray-500">Balance</div>
              <div className="text-right font-semibold">
                {quote ? Math.max(0, Number(quote.total || 0) - Number(payment.advancePaid || 0)).toFixed(2) : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

