'use client'

import CalendarCell from './CalendarCell'

export default function RoomGridView({ dates, rooms, cells, onDropReservation }) {
  const dayLabels = dates || []
  const roomRows = rooms || []

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 rounded-2xl p-3 text-white shadow-md">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: `140px repeat(${dayLabels.length}, minmax(60px, 1fr))` }}>
          <div className="bg-blue-900/60 border-b border-r border-blue-800 px-3 py-2 text-xs font-semibold sticky left-0 z-10">
            Room
          </div>
          {dayLabels.map((d) => (
            <div
              key={d}
              className="bg-blue-900/60 border-b border-blue-800 px-1 py-2 text-[11px] text-center font-semibold"
            >
              {d.slice(8, 10)}
            </div>
          ))}

          {roomRows.map((room) => (
            <div key={room.id} className="contents">
              <div className="bg-blue-900/40 border-t border-r border-blue-800 px-3 py-2 text-xs sticky left-0 z-10">
                <div className="font-semibold">Room {room.roomNumber}</div>
                <div className="text-[10px] text-blue-100">{room.roomType}</div>
              </div>
              {dayLabels.map((d) => (
                <CalendarCell
                  key={`${room.id}-${d}`}
                  roomId={room.id}
                  date={d}
                  cell={cells?.[room.id]?.[d]}
                  onDropReservation={onDropReservation}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

