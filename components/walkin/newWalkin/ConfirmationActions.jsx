'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, UserCheck, Printer } from 'lucide-react'

export default function ConfirmationActions({
  submitting,
  canSubmit,
  onCheckIn,
  onPrintRegistrationCard,
  walkin,
}) {
  const isCheckedIn = walkin && walkin.status === 'checked_in'

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <CheckCircle className="h-5 w-5" />
          Confirmation Actions
        </CardTitle>
        <p className="text-white/80 text-sm">
          {isCheckedIn
            ? 'Guest checked in successfully!'
            : 'Confirm and check-in guest immediately'}
        </p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
        <div className="space-y-3">
          {!isCheckedIn ? (
            <Button
              onClick={onCheckIn}
              disabled={submitting || !canSubmit}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserCheck className="h-5 w-5 mr-2" />
                  Check-In Now
                </>
              )}
            </Button>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 py-3 bg-green-500/30 rounded-lg border border-green-400/50">
                <CheckCircle className="h-6 w-6 text-green-300" />
                <span className="font-semibold text-green-100">Guest Checked In!</span>
              </div>
              <Button
                onClick={onPrintRegistrationCard}
                variant="outline"
                className="w-full h-12 border-white/30 text-white hover:bg-white/20"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Registration Card
              </Button>
            </>
          )}

          {!canSubmit && !isCheckedIn && (
            <p className="text-amber-300 text-xs text-center">
              Complete guest details, room selection, and check-out date to proceed
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
