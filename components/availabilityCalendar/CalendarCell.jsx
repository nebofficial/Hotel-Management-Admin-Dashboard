'use client'

import { cn } from '@/lib/utils'

const STATUS_COLORS = {
  available: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100',
  reserved: 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100',
  occupied: 'bg-red-50 border-red-100 hover:bg-red-100',
  maintenance: 'bg-blue-50 border-blue-100 hover:bg-blue-100',
  overbooked: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
}

export default function CalendarCell({ roomId, date, cell, onDropReservation }) {
  const status = cell?.status || 'available'

  const handleDrop = (e) => {
    e.preventDefault()
    const payload = e.dataTransfer.getData('application/json')
    if (!payload) return
    try {
      const data = JSON.parse(payload)
      if (data && data.bookingId) {
        onDropReservation?.({
          bookingId: data.bookingId,
          sourceType: data.sourceType,
          fromRoomId: data.roomId,
          fromDate: data.date,
          toRoomId: roomId,
          toDate: date,
        })
      }
    } catch {
      // ignore
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const baseClass =
    'relative h-10 border text-[11px] flex items-center justify-center cursor-pointer transition-colors select-none'

  return (
    <div
      className={cn(baseClass, STATUS_COLORS[status] || STATUS_COLORS.available)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      data-status={status}
    >
      {cell?.reservations?.length ? (
        <div className="flex flex-col items-center gap-0.5 w-full px-0.5">
          {cell.reservations.map((r) => (
            <div
              key={`${r.source}-${r.bookingId}-${r.checkIn}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify({
                    bookingId: r.bookingId,
                    sourceType: r.source,
                    roomId,
                    date,
                  })
                )
              }}
              className={cn(
                'w-full truncate rounded px-1 py-0.5 text-[10px] font-medium shadow-sm',
                r.source === 'walkin' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'
              )}
              title={`${r.bookingNumber} • ${r.guestName || ''}`}
            >
              {r.bookingNumber}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

