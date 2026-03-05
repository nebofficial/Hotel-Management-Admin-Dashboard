'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ConfirmationActions({ submitting, onConfirm, onTentative }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-red-700 via-rose-700 to-orange-700 text-white">
      <CardHeader>
        <CardTitle className="text-white text-sm">Confirmation Actions</CardTitle>
        <div className="text-xs text-rose-100/90">
          Confirm to lock group and blocked rooms. Tentative keeps rooms available for others.
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="bg-white text-red-700 hover:bg-red-50 h-10 text-sm font-semibold"
          >
            {submitting ? 'Saving…' : 'Confirm Group Booking'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onTentative}
            disabled={submitting}
            className="h-10 text-sm font-semibold"
          >
            {submitting ? 'Saving…' : 'Save as Tentative'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

