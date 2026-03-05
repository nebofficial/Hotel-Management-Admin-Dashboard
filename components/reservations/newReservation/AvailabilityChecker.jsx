'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AvailabilityChecker({ stay, availability, onCheck }) {
  const disabled = !(stay?.checkIn && stay?.checkOut && stay?.roomType)

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 text-white">
      <CardHeader>
        <CardTitle className="text-white">Real-time Availability</CardTitle>
        <div className="text-white/80 text-sm">Shows available rooms count instantly.</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-white/80">Available Rooms</div>
            <div className="text-2xl font-semibold">
              {availability?.availableCount == null ? '—' : availability.availableCount}
            </div>
            {availability?.lastChecked && (
              <div className="text-[11px] text-white/70 mt-1">
                Last checked: {new Date(availability.lastChecked).toLocaleTimeString()}
              </div>
            )}
          </div>
          <Button
            onClick={() => onCheck?.()}
            disabled={disabled}
            className="bg-white/90 text-blue-700 hover:bg-white"
          >
            Check Now
          </Button>
        </div>
        {disabled && <div className="mt-3 text-xs text-white/70">Select dates + room type to check availability.</div>}
      </CardContent>
    </Card>
  )
}

