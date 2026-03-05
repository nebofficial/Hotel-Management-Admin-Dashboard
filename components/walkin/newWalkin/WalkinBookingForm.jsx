'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

import QuickGuestEntry from './QuickGuestEntry'
import RoomAvailabilityPanel from './RoomAvailabilityPanel'
import SameDayCheckinPanel from './SameDayCheckinPanel'
import RateCalculationPanel from './RateCalculationPanel'
import PaymentCollectionPanel from './PaymentCollectionPanel'
import BillPreview from './BillPreview'
import ConfirmationActions from './ConfirmationActions'
import RegistrationCardPrint from './RegistrationCardPrint'

import {
  generateWalkinNumber,
  getAvailableRooms,
  lookupGuest,
  calculateRate,
  createWalkin,
  generateRegistrationCard,
  fetchRoomTypes,
} from '@/services/api/walkinApi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function WalkinBookingForm() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [refreshingRooms, setRefreshingRooms] = useState(false)

  const [walkinNumber, setWalkinNumber] = useState('')
  const [guestInfo, setGuestInfo] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    numberOfGuests: 1,
    idProofType: '',
    idProofNumber: '',
  })
  const [existingGuest, setExistingGuest] = useState(null)

  const [roomTypes, setRoomTypes] = useState([])
  const [selectedRoomType, setSelectedRoomType] = useState('')
  const [availableRooms, setAvailableRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)

  const [checkinInfo, setCheckinInfo] = useState({
    expectedCheckOut: '',
    occupancyType: 'single',
  })

  const [pricing, setPricing] = useState(null)
  const [extraBed, setExtraBed] = useState(false)

  const [payment, setPayment] = useState({
    paymentType: 'full',
    paymentMode: 'cash',
    paidAmount: 0,
  })

  const [createdWalkin, setCreatedWalkin] = useState(null)
  const [registrationCard, setRegistrationCard] = useState(null)

  const printRef = useRef(null)
  const debounceRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Registration-${createdWalkin?.walkinNumber || 'Card'}`,
  })

  useEffect(() => {
    let mounted = true

    async function init() {
      if (!apiBase) return
      setLoading(true)
      try {
        const [wn, types, roomsData] = await Promise.all([
          generateWalkinNumber(apiBase).catch(() => ''),
          fetchRoomTypes(apiBase).catch(() => []),
          getAvailableRooms(apiBase, {}).catch(() => ({ availableRooms: [] })),
        ])
        if (mounted) {
          setWalkinNumber(wn || '')
          setRoomTypes(types || [])
          setAvailableRooms(roomsData.availableRooms || [])
        }
      } catch (e) {
        console.error('Init error:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => {
      mounted = false
    }
  }, [apiBase])

  const refreshRooms = useCallback(async () => {
    if (!apiBase) return
    setRefreshingRooms(true)
    try {
      const params = {}
      if (selectedRoomType && selectedRoomType !== 'all') {
        params.roomType = selectedRoomType
      }
      if (checkinInfo.expectedCheckOut) {
        params.checkOut = checkinInfo.expectedCheckOut
      }
      const data = await getAvailableRooms(apiBase, params)
      setAvailableRooms(data.availableRooms || [])
    } catch (e) {
      console.error('Refresh rooms error:', e)
    } finally {
      setRefreshingRooms(false)
    }
  }, [apiBase, selectedRoomType, checkinInfo.expectedCheckOut])

  useEffect(() => {
    refreshRooms()
  }, [selectedRoomType, checkinInfo.expectedCheckOut, refreshRooms])

  const handlePhoneLookup = useCallback(
    async (phone) => {
      if (!apiBase || !phone) return
      try {
        const data = await lookupGuest(apiBase, phone)
        if (data.found && data.guest) {
          setExistingGuest(data.guest)
        } else {
          setExistingGuest(null)
        }
      } catch (e) {
        console.error('Guest lookup error:', e)
      }
    },
    [apiBase]
  )

  const recalcPricing = useCallback(async () => {
    if (!apiBase || !selectedRoom || !checkinInfo.expectedCheckOut) {
      setPricing(null)
      return
    }
    try {
      const data = await calculateRate(apiBase, {
        checkIn: new Date().toISOString(),
        checkOut: checkinInfo.expectedCheckOut,
        baseRoomRate: selectedRoom.pricePerNight || 0,
        occupancyType: checkinInfo.occupancyType,
        extraBed,
        extraServices: [],
      })
      setPricing(data)
      if (payment.paymentType === 'full') {
        setPayment((prev) => ({ ...prev, paidAmount: data.totalAmount || 0 }))
      }
    } catch (e) {
      console.error('Pricing error:', e)
      setPricing(null)
    }
  }, [apiBase, selectedRoom, checkinInfo.expectedCheckOut, checkinInfo.occupancyType, extraBed, payment.paymentType])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      recalcPricing()
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [recalcPricing])

  const canSubmit =
    guestInfo.guestName &&
    guestInfo.guestPhone &&
    selectedRoom &&
    checkinInfo.expectedCheckOut &&
    pricing

  const handleCheckIn = async () => {
    if (!apiBase || !canSubmit) return
    setSubmitting(true)
    try {
      const payload = {
        guestName: guestInfo.guestName,
        guestPhone: guestInfo.guestPhone,
        guestEmail: guestInfo.guestEmail || undefined,
        numberOfGuests: guestInfo.numberOfGuests || 1,
        idProofType: guestInfo.idProofType || undefined,
        idProofNumber: guestInfo.idProofNumber || undefined,
        roomId: selectedRoom.id,
        expectedCheckOut: checkinInfo.expectedCheckOut,
        occupancyType: checkinInfo.occupancyType,
        extraBed,
        extraServices: [],
        paidAmount: payment.paidAmount || 0,
        paymentMode: payment.paymentMode,
        paymentDetails: {
          cardLast4: payment.cardLast4,
          upiTransactionId: payment.upiTransactionId,
        },
        specialRequests: '',
      }

      const result = await createWalkin(apiBase, payload)
      setCreatedWalkin(result.walkin)

      const cardData = await generateRegistrationCard(apiBase, result.walkin.id)
      setRegistrationCard(cardData.card)

      const newNumber = await generateWalkinNumber(apiBase).catch(() => '')
      setWalkinNumber(newNumber)

      refreshRooms()
    } catch (e) {
      alert(e.message || 'Failed to create walk-in booking')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrintBill = () => {
    window.print()
  }

  const handlePrintRegistrationCard = () => {
    if (printRef.current) {
      handlePrint()
    }
  }

  const resetForm = () => {
    setGuestInfo({
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      numberOfGuests: 1,
      idProofType: '',
      idProofNumber: '',
    })
    setExistingGuest(null)
    setSelectedRoom(null)
    setCheckinInfo({ expectedCheckOut: '', occupancyType: 'single' })
    setPricing(null)
    setExtraBed(false)
    setPayment({ paymentType: 'full', paymentMode: 'cash', paidAmount: 0 })
    setCreatedWalkin(null)
    setRegistrationCard(null)
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to create a walk-in booking.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-gray-600">Preparing Walk-in Booking…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Walk-in Booking</h1>
          <p className="text-gray-600 mt-1">
            Quick check-in for guests without prior reservation
          </p>
        </div>
        {createdWalkin && (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            New Walk-in
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <QuickGuestEntry
            walkinNumber={walkinNumber}
            value={guestInfo}
            onChange={setGuestInfo}
            onPhoneLookup={handlePhoneLookup}
            existingGuest={existingGuest}
          />

          <RoomAvailabilityPanel
            roomTypes={roomTypes}
            selectedRoomType={selectedRoomType}
            onRoomTypeChange={setSelectedRoomType}
            availableRooms={availableRooms}
            selectedRoom={selectedRoom}
            onRoomSelect={setSelectedRoom}
            onRefresh={refreshRooms}
            loading={refreshingRooms}
          />

          <SameDayCheckinPanel value={checkinInfo} onChange={setCheckinInfo} />
        </div>

        <div className="xl:col-span-5 space-y-6">
          <RateCalculationPanel
            pricing={pricing}
            extraBed={extraBed}
            onExtraBedChange={setExtraBed}
          />

          <PaymentCollectionPanel
            value={payment}
            onChange={setPayment}
            totalAmount={pricing?.totalAmount || 0}
          />

          <BillPreview
            walkin={createdWalkin}
            pricing={pricing}
            onPrint={handlePrintBill}
          />

          <ConfirmationActions
            submitting={submitting}
            canSubmit={canSubmit}
            onCheckIn={handleCheckIn}
            onPrintRegistrationCard={handlePrintRegistrationCard}
            walkin={createdWalkin}
          />
        </div>
      </div>

      <div className="hidden">
        <RegistrationCardPrint
          ref={printRef}
          card={registrationCard}
          hotelName={hotel?.name || 'Hotel'}
        />
      </div>
    </div>
  )
}
