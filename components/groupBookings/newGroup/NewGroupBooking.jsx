'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'

import MasterGroupInfo from './MasterGroupInfo'
import RoomBlockManager from './RoomBlockManager'
import GuestListManager from './GuestListManager'
import GroupRateManager from './GroupRateManager'
import GroupDiscountPanel from './GroupDiscountPanel'
import GroupBillingOptions from './GroupBillingOptions'
import GroupPaymentPanel from './GroupPaymentPanel'
import ConfirmationActions from './ConfirmationActions'

import {
  applyGroupDiscount,
  blockRooms,
  createGroupBooking,
  fetchRooms,
  generateMasterGroupId,
} from '@/services/api/groupBookingApi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function NewGroupBooking() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [masterGroupId, setMasterGroupId] = useState('')
  const [masterInfo, setMasterInfo] = useState({
    groupName: '',
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    checkIn: '',
    checkOut: '',
    totalRoomsRequired: 0,
  })

  const [roomBlocks, setRoomBlocks] = useState([])
  const [guestList, setGuestList] = useState([])
  const [discountConfig, setDiscountConfig] = useState({
    discountPercent: 0,
    discountFlat: 0,
  })
  const [rateConfig, setRateConfig] = useState({
    ratePlan: 'standard',
  })
  const [billingMode, setBillingMode] = useState('consolidated')
  const [payment, setPayment] = useState({
    advancePaid: 0,
    mode: 'cash',
  })

  const [availabilityByType, setAvailabilityByType] = useState(null)
  const [pricingTotals, setPricingTotals] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])

  const debounceRef = useRef(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      if (!apiBase) return
      setLoading(true)
      try {
        const [id, roomsData] = await Promise.all([
          generateMasterGroupId(apiBase),
          fetchRooms(apiBase).catch(() => ({ rooms: [] })),
        ])
        if (mounted) {
          setMasterGroupId(id || '')
          const types = [...new Set((roomsData.rooms || []).map((r) => r.roomType).filter(Boolean))].sort()
          setRoomTypes(types)
        }
      } catch (e) {
        if (mounted) setMasterGroupId('')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => {
      mounted = false
    }
  }, [apiBase])

  const totalRoomsFromBlocks = useMemo(
    () => roomBlocks.reduce((sum, b) => sum + Number(b.quantity || 0), 0),
    [roomBlocks]
  )

  const effectiveTotalRooms = masterInfo.totalRoomsRequired || totalRoomsFromBlocks

  const handleValidateBlocks = async () => {
    if (!apiBase || !masterInfo.checkIn || !masterInfo.checkOut) return
    try {
      const res = await blockRooms(apiBase, {
        checkIn: masterInfo.checkIn,
        checkOut: masterInfo.checkOut,
        roomBlocks,
      })
      setAvailabilityByType(res.availabilityByType || {})
    } catch (e) {
      if (e?.message) alert(e.message)
    }
  }

  const recalcPricing = async () => {
    if (!apiBase || !masterInfo.checkIn || !masterInfo.checkOut) return
    const firstBlock = roomBlocks.find((b) => Number(b.ratePerNight || 0) > 0)
    const ratePerNight = firstBlock ? Number(firstBlock.ratePerNight || 0) : 0
    try {
      const res = await applyGroupDiscount(apiBase, {
        checkIn: masterInfo.checkIn,
        checkOut: masterInfo.checkOut,
        ratePerNight,
        totalRooms: effectiveTotalRooms,
        discountPercent: Number(discountConfig.discountPercent || 0) / 100,
        discountFlat: Number(discountConfig.discountFlat || 0),
      })
      setPricingTotals(res)
    } catch (e) {
      console.error(e)
      setPricingTotals(null)
    }
  }

  useEffect(() => {
    if (!masterInfo.checkIn || !masterInfo.checkOut) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      recalcPricing()
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterInfo.checkIn, masterInfo.checkOut, roomBlocks, discountConfig, rateConfig, masterInfo.totalRoomsRequired])

  const handleSubmit = async (confirm) => {
    if (!apiBase) return
    setSubmitting(true)
    try {
      const payload = {
        masterGroupId: masterGroupId || undefined,
        groupName: masterInfo.groupName,
        companyName: masterInfo.companyName,
        contactName: masterInfo.contactName,
        contactPhone: masterInfo.contactPhone,
        contactEmail: masterInfo.contactEmail,
        checkIn: masterInfo.checkIn,
        checkOut: masterInfo.checkOut,
        totalRoomsRequired: effectiveTotalRooms,
        roomBlocks,
        guestList,
        ratePlan: rateConfig.ratePlan,
        discountPercent: Number(discountConfig.discountPercent || 0) / 100,
        discountFlat: Number(discountConfig.discountFlat || 0),
        billingMode,
        advancePaid: payment.advancePaid,
        notes: '',
        confirm: Boolean(confirm),
      }
      const res = await createGroupBooking(apiBase, payload)
      alert(
        confirm
          ? `Group booking confirmed: ${res?.groupBooking?.masterGroupId || 'Created'}`
          : `Group booking saved as tentative: ${res?.groupBooking?.masterGroupId || 'Created'}`
      )
      const nextId = await generateMasterGroupId(apiBase).catch(() => '')
      setMasterGroupId(nextId || '')
    } catch (e) {
      alert(e?.message || 'Failed to create group booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to create a group booking.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-gray-600">Preparing New Group Booking…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Group Booking</h1>
          <p className="text-gray-600 mt-1">
            Create master group bookings with room blocks, guest lists, group rates, and consolidated
            billing.
          </p>
        </div>
        <div className="rounded-xl border bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
          <div className="text-xs text-gray-500">Master Group ID</div>
          <div className="text-lg font-semibold tracking-tight text-gray-900">
            {masterGroupId || '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <MasterGroupInfo
            masterGroupId={masterGroupId}
            onMasterGroupIdChange={setMasterGroupId}
            value={masterInfo}
            onChange={setMasterInfo}
          />

          <RoomBlockManager
            value={roomBlocks}
            onChange={setRoomBlocks}
            availability={availabilityByType}
            onValidate={handleValidateBlocks}
            roomTypes={roomTypes}
          />

          <GuestListManager value={guestList} onChange={setGuestList} />
        </div>

        <div className="xl:col-span-5 space-y-6">
          <GroupRateManager value={rateConfig} onChange={setRateConfig} totals={pricingTotals} />
          <GroupDiscountPanel value={discountConfig} onChange={setDiscountConfig} />
          <GroupBillingOptions value={billingMode} onChange={setBillingMode} />
          <GroupPaymentPanel value={payment} onChange={setPayment} totals={pricingTotals} />
          <ConfirmationActions
            submitting={submitting}
            onConfirm={() => handleSubmit(true)}
            onTentative={() => handleSubmit(false)}
          />
        </div>
      </div>
    </div>
  )
}

