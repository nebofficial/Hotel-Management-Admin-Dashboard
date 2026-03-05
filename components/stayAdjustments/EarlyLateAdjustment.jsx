'use client'

import { useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'

import StayDetailsPanel from './StayDetailsPanel'
import EarlyCheckInPanel from './EarlyCheckInPanel'
import LateCheckOutPanel from './LateCheckOutPanel'
import HourlyRateCalculator from './HourlyRateCalculator'
import ApprovalWorkflowPanel from './ApprovalWorkflowPanel'
import ChargePreviewPanel from './ChargePreviewPanel'
import HousekeepingNotification from './HousekeepingNotification'

import { getAllReservations } from '@/services/api/reservationApi'
import {
  getStayForAdjustment,
  calculateHourlyCharge,
  requestApproval,
  applyExtraCharge,
  notifyHousekeeping,
} from '@/services/api/stayAdjustmentApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function EarlyLateAdjustment() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)

  const [booking, setBooking] = useState(null)
  const [stay, setStay] = useState(null)
  const [charges, setCharges] = useState([])
  const [approval, setApproval] = useState(null)

  const [early, setEarly] = useState({})
  const [late, setLate] = useState({})
  const [summary, setSummary] = useState(null)
  const [requestingApproval, setRequestingApproval] = useState(false)
  const [applyingCharge, setApplyingCharge] = useState(false)
  const [notifying, setNotifying] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!apiBase) return
    setLoading(true)
    try {
      const data = await getAllReservations(apiBase, { search, status: 'confirmed' })
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
      const data = await getStayForAdjustment(apiBase, bookingId)
      setBooking(data.booking)
      setStay(data.stay)
      setCharges(data.charges || [])
      setApproval(data.approval || null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSelectReservation = async (r) => {
    setSelected(r)
    setSummary(null)
    setEarly({})
    setLate({})
    await loadStay(r.id)
  }

  const recomputeSummary = async (nextEarly, nextLate) => {
    if (!apiBase || !selected) return
    const bookingId = selected.id

    const requestedCheckIn =
      nextEarly.date && nextEarly.time ? `${nextEarly.date}T${nextEarly.time}:00` : undefined
    const requestedCheckOut =
      nextLate.date && nextLate.time ? `${nextLate.date}T${nextLate.time}:00` : undefined

    if (!requestedCheckIn && !requestedCheckOut) {
      setSummary(null)
      return
    }

    try {
      const res = await calculateHourlyCharge(apiBase, {
        bookingId,
        requestedCheckIn,
        requestedCheckOut,
      })
      setSummary(res)
    } catch (e) {
      console.error(e)
    }
  }

  const handleEarlyChange = async (val) => {
    setEarly(val)
    await recomputeSummary(val, late)
  }

  const handleLateChange = async (val) => {
    setLate(val)
    await recomputeSummary(early, val)
  }

  const handleRequestApproval = async ({ managerName, reason }) => {
    if (!apiBase || !selected || !summary) return
    setRequestingApproval(true)
    try {
      const res = await requestApproval(apiBase, {
        bookingId: selected.id,
        managerName,
        reason,
        totalCharge: summary.totalExtraCharge,
      })
      setApproval(res.approval)
      alert('Approval request saved.')
    } catch (e) {
      alert(e.message || 'Failed to request approval')
    } finally {
      setRequestingApproval(false)
    }
  }

  const handleApplyCharge = async () => {
    if (!apiBase || !selected || !summary) return
    setApplyingCharge(true)
    try {
      const res = await applyExtraCharge(apiBase, {
        bookingId: selected.id,
        type:
          summary.earlyCharge && summary.lateCharge
            ? 'both'
            : summary.earlyCharge
            ? 'early_checkin'
            : 'late_checkout',
        description: 'Early/Late stay adjustment',
        hoursEarly: summary.earlyHours,
        hoursLate: summary.lateHours,
        amount: summary.totalExtraCharge,
      })
      setCharges((prev) => [...prev, res.charge])
      alert('Adjustment charge recorded. It will be considered in final billing.')
    } catch (e) {
      alert(e.message || 'Failed to apply charge')
    } finally {
      setApplyingCharge(false)
    }
  }

  const handleNotifyHk = async () => {
    if (!apiBase || !selected) return
    setNotifying(true)
    try {
      const res = await notifyHousekeeping(apiBase, {
        bookingId: selected.id,
        roomId: booking?.roomId,
        type:
          summary?.earlyCharge && summary?.lateCharge
            ? 'both'
            : summary?.earlyCharge
            ? 'early_checkin'
            : summary?.lateCharge
            ? 'late_checkout'
            : 'adjustment',
        requestedCheckIn:
          early.date && early.time ? `${early.date}T${early.time}:00` : undefined,
        requestedCheckOut:
          late.date && late.time ? `${late.date}T${late.time}:00` : undefined,
      })
      alert(res.message || 'Housekeeping task created for this adjustment.')
    } catch (e) {
      alert(e.message || 'Failed to notify housekeeping')
    } finally {
      setNotifying(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to manage stay adjustments.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/15 to-violet-50/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Early Check-In / Late Check-Out</h1>
          <p className="text-gray-600 mt-1">
            Calculate adjustments, manage approvals, and apply charges for flexible stays.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reservations…"
            className="h-9 w-60"
          />
          <Button type="submit" className="h-9">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 space-y-4">
          <StayDetailsPanel booking={booking} stay={stay} />

          <div className="bg-white rounded-xl shadow-sm border p-3 text-xs">
            <div className="font-semibold mb-2 text-gray-800">Select Stay</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {reservations.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectReservation(r)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-left ${
                    selected?.id === r.id
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
                    {new Date(r.checkIn).toLocaleDateString('en-IN')}
                  </div>
                </button>
              ))}
              {!reservations.length && (
                <p className="text-[11px] text-gray-500 text-center py-2">
                  Search for reservations to start early/late adjustment.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EarlyCheckInPanel value={early} onChange={handleEarlyChange} />
            <LateCheckOutPanel value={late} onChange={handleLateChange} />
          </div>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <HourlyRateCalculator summary={summary} />
          <ApprovalWorkflowPanel
            approvalRequired={summary?.approvalRequired}
            totalCharge={summary?.totalExtraCharge}
            existingApproval={approval}
            onRequest={handleRequestApproval}
          />
          <ChargePreviewPanel
            baseEstimate={booking?.totalAmount || 0}
            chargeSummary={summary}
            appliedCharges={charges}
          />
          <Button
            type="button"
            className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
            disabled={!summary || applyingCharge}
            onClick={handleApplyCharge}
          >
            {applyingCharge ? 'Applying Charge…' : 'Apply Charge to Stay'}
          </Button>
          <HousekeepingNotification disabled={!selected} notifying={notifying} onNotify={handleNotifyHk} />
        </div>
      </div>
    </div>
  )
}

