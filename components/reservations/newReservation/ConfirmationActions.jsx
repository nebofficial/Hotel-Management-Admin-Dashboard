'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ConfirmationActions({ submitting, quote, stay, guest, onConfirm, onTentative }) {
  const missing =
    !stay?.checkIn ||
    !stay?.checkOut ||
    !stay?.roomType ||
    !guest?.firstName ||
    !guest?.phone

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-red-700 via-rose-700 to-orange-700 text-white">
      <CardHeader>
        <CardTitle className="text-white">Confirmation Actions</CardTitle>
        <div className="text-white/80 text-sm">
          Confirm blocks a room. Tentative does <span className="font-semibold">not</span> block availability.
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={onConfirm}
            disabled={submitting || missing || !quote}
            className="bg-white text-red-700 hover:bg-white/95 h-11 font-semibold"
          >
            {submitting ? 'Saving…' : 'Confirm Reservation'}
          </Button>
          <Button
            onClick={onTentative}
            disabled={submitting || missing}
            variant="secondary"
            className="h-11 font-semibold"
          >
            {submitting ? 'Saving…' : 'Save as Tentative'}
          </Button>
        </div>

        {missing && (
          <div className="text-xs text-white/80">
            Required: check-in/out, room type, guest first name, and phone.
          </div>
        )}
        {!quote && (
          <div className="text-xs text-white/80">
            Tip: select dates + room type to calculate pricing and enable confirmation.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

