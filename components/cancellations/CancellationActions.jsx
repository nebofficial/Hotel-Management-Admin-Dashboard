'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function CancellationActions({ canCancel, cancelling, onCancel }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <CheckCircle2 className="h-5 w-5" />
          Confirm Cancellation
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-2">
        <Button
          type="button"
          disabled={!canCancel || cancelling}
          onClick={onCancel}
          className="w-full h-10 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 font-semibold text-sm"
        >
          {cancelling ? 'Cancelling…' : 'Confirm Cancellation'}
        </Button>
        {!canCancel && (
          <p className="text-[11px] text-amber-100 text-center">
            Select a reservation and provide a reason before confirming cancellation.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

