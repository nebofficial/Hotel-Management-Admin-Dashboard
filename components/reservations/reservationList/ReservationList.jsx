'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllReservations } from '@/services/api/reservationApi'
import ReservationFilters from './ReservationFilters'
import ReservationTable from './ReservationTable'
import ModifyReservationModal from './ModifyReservationModal'
import CancelReservationModal from './CancelReservationModal'
import ReservationVoucher from './ReservationVoucher'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function isToday(d) {
  if (!d) return false
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return false
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export default function ReservationList() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState([])
  const [filters, setFilters] = useState({})
  const [selected, setSelected] = useState(null)
  const [voucherFor, setVoucherFor] = useState(null)
  const [modifyOpen, setModifyOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [voucherOpen, setVoucherOpen] = useState(false)
  const debounceRef = useRef(null)

  const loadReservations = useCallback(
    async (opts = {}) => {
      if (!apiBase) return
      setLoading(true)
      try {
        const params = {
          status: opts.status || filters.status || '',
          checkInFrom: opts.checkInFrom || filters.checkInFrom || '',
          checkInTo: opts.checkInTo || filters.checkInTo || '',
          roomType: opts.roomType || filters.roomType || '',
        }

        // combine search fields into a single search term for backend;
        // frontend still keeps separate inputs.
        const primarySearch =
          opts.reservationNumber ||
          filters.reservationNumber ||
          opts.guestName ||
          filters.guestName ||
          opts.phone ||
          filters.phone ||
          ''
        if (primarySearch) params.search = primarySearch

        const { reservations: rows = [] } = await getAllReservations(apiBase, params)
        setReservations(rows)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [apiBase, filters]
  )

  useEffect(() => {
    if (!apiBase) return
    loadReservations()
  }, [apiBase, loadReservations])

  const handleFiltersChange = (next) => {
    setFilters(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      loadReservations(next)
    }, 300)
  }

  const summary = useMemo(() => {
    const today = reservations.filter((r) => isToday(r.checkIn))
    const totalToday = today.length
    const confirmed = today.filter((r) => r.status === 'confirmed').length
    const checkedIn = today.filter((r) => r.status === 'checked_in').length
    const pending = today.filter((r) => r.status === 'pending').length
    const cancelled = today.filter((r) => r.status === 'cancelled' && !r.isNoShow).length
    const noShow = today.filter((r) => r.isNoShow).length
    return { totalToday, confirmed, checkedIn, pending, cancelled: cancelled + noShow }
  }, [reservations])

  const handleEdit = (reservation) => {
    setSelected(reservation)
    setModifyOpen(true)
  }

  const handleCancel = (reservation) => {
    setSelected(reservation)
    setCancelOpen(true)
  }

  const handlePrint = (reservation) => {
    setVoucherFor(reservation)
    setVoucherOpen(true)
  }

  const handleUpdated = () => {
    loadReservations()
  }

  const handleCancelled = () => {
    loadReservations()
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to view reservations.</p>
      </div>
    )
  }

  if (loading && reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-gray-600">Loading reservations…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservation List</h1>
          <p className="text-gray-600 mt-1">
            View, filter, modify, cancel, and print vouchers for all reservations.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <CardHeader>
          <CardTitle className="text-white text-sm">Today&apos;s Overview</CardTitle>
          <div className="text-xs text-emerald-50/90">
            Real-time summary of today&apos;s reservations and guest activity.
          </div>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <div className="text-emerald-100/90">Total Reservations Today</div>
              <div className="text-lg font-semibold">{summary.totalToday}</div>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <div className="text-emerald-100/90">Confirmed</div>
              <div className="text-lg font-semibold">{summary.confirmed}</div>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <div className="text-emerald-100/90">Checked-in Guests</div>
              <div className="text-lg font-semibold">{summary.checkedIn}</div>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <div className="text-emerald-100/90">Pending Bookings</div>
              <div className="text-lg font-semibold">{summary.pending}</div>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <div className="text-emerald-100/90">Cancelled / No-show</div>
              <div className="text-lg font-semibold">{summary.cancelled}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReservationFilters filters={filters} onChange={handleFiltersChange} />

      <ReservationTable
        reservations={reservations}
        loading={loading}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onPrint={handlePrint}
      />

      <ModifyReservationModal
        apiBase={apiBase}
        open={modifyOpen}
        onOpenChange={setModifyOpen}
        reservation={selected}
        onUpdated={handleUpdated}
      />

      <CancelReservationModal
        apiBase={apiBase}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        reservation={selected}
        onCancelled={handleCancelled}
      />

      <ReservationVoucher
        open={voucherOpen}
        onOpenChange={setVoucherOpen}
        reservation={voucherFor}
      />
    </div>
  )
}

