'use client'

import { Card, CardContent } from '@/components/ui/card'

const ITEMS = [
  { key: 'available', label: 'Available', color: 'bg-emerald-500' },
  { key: 'reserved', label: 'Reserved (Future)', color: 'bg-yellow-400' },
  { key: 'occupied', label: 'Occupied', color: 'bg-red-500' },
  { key: 'maintenance', label: 'Maintenance / Blocked', color: 'bg-blue-500' },
  { key: 'overbooked', label: 'Overbooked', color: 'bg-rose-600' },
]

export default function RoomStatusLegend() {
  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white">
      <CardContent className="py-2 px-4 flex flex-wrap items-center gap-3 text-xs">
        {ITEMS.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-sm border border-white/50 ${item.color}`} />
            <span className="font-medium drop-shadow-sm">{item.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

