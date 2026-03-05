'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2, Wrench } from 'lucide-react'

import CalendarToolbar from './CalendarToolbar'
import RoomStatusLegend from './RoomStatusLegend'
import OverbookingAlert from './OverbookingAlert'
import RoomGridView from './RoomGridView'
import MaintenanceBlockModal from './MaintenanceBlockModal'

import { getCalendarData, blockRoom, moveReservation } from '@/services/api/availabilityApi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function RoomAvailabilityCalendar() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [view, setView] = useState('weekly')
  const [startDate, setStartDate] = useState(new Date())
  const [roomType, setRoomType] = useState('')

  const [loading, setLoading] = useState(true)
  const [calendar, setCalendar] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])

  const [maintenanceRoom, setMaintenanceRoom] = useState(null)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)

  const [moving, setMoving] = useState(false)

  const startParam = useMemo(() => startDate.toISOString().slice(0, 10), [startDate])

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!apiBase) return
      setLoading(true)
      try {
        const data = await getCalendarData(apiBase, {
          view,
          start: startParam,
          roomType: roomType || undefined,
        })
        if (!mounted) return
        setCalendar(data)
        const types =
          data?.rooms?.map((r) => r.roomType).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).sort() || []
        setRoomTypes(types)
      } catch (e) {
        console.error('Calendar load error:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [apiBase, view, startParam, roomType])

  const handleDropReservation = async ({ bookingId, sourceType, toRoomId, toDate }) => {
    if (!apiBase || !bookingId || !toRoomId || !toDate) return
    if (sourceType !== 'booking') {
      alert('Drag & drop is only supported for normal reservations right now.')
      return
    }
    const nights = 1
    const newCheckIn = toDate
    const newCheckOut = new Date(new Date(toDate).getTime() + nights * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)

    setMoving(true)
    try {
      await moveReservation(apiBase, bookingId, {
        checkIn: newCheckIn,
        checkOut: newCheckOut,
        roomId: toRoomId,
      })
      const data = await getCalendarData(apiBase, {
        view,
        start: startParam,
        roomType: roomType || undefined,
      })
      setCalendar(data)
    } catch (e) {
      alert(e.message || 'Failed to move reservation')
    } finally {
      setMoving(false)
    }
  }

  const handleOpenMaintenance = (room) => {
    setMaintenanceRoom(room)
    setShowMaintenanceModal(true)
  }

  const handleSaveMaintenance = async (payload) => {
    await blockRoom(apiBase, payload)
    const data = await getCalendarData(apiBase, {
      view,
      start: startParam,
      roomType: roomType || undefined,
    })
    setCalendar(data)
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to view the availability calendar.</p>
      </div>
    )
  }

  if (loading && !calendar) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-gray-600">Loading availability calendar…</p>
      </div>
    )
  }

  const dates = calendar?.dates || []
  const rooms = calendar?.rooms || []
  const cells = calendar?.cells || {}

  return (
    <div className="p-6 space-y-4 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/25 to-violet-50/25">
      <CalendarToolbar
        view={view}
        onViewChange={setView}
        startDate={startDate}
        onStartDateChange={setStartDate}
        roomType={roomType}
        roomTypes={roomTypes}
        onRoomTypeChange={setRoomType}
      />

      <OverbookingAlert summary={calendar?.overbookingSummary} />

      <div className="flex flex-col xl:flex-row gap-4 items-start">
        <div className="flex-1 space-y-3">
          <RoomGridView dates={dates} rooms={rooms} cells={cells} onDropReservation={handleDropReservation} />
          {moving && (
            <p className="text-xs text-gray-500 mt-1">
              Updating reservation… please wait a moment.
            </p>
          )}
        </div>

        <div className="w-full xl:w-64 space-y-3">
          <RoomStatusLegend />
          <button
            type="button"
            disabled={!rooms.length}
            onClick={() => rooms.length && handleOpenMaintenance(rooms[0])}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Wrench className="h-4 w-4" />
            Maintenance Block
          </button>
          <p className="text-[11px] text-gray-600">
            Tip: Drag a green reservation bar and drop it on another date/room to quickly move bookings. Walk-ins are
            visible but not draggable yet.
          </p>
        </div>
      </div>

      <MaintenanceBlockModal
        open={showMaintenanceModal}
        onOpenChange={setShowMaintenanceModal}
        room={maintenanceRoom}
        onSave={handleSaveMaintenance}
      />
    </div>
  )
}

