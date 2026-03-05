'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function CheckInActions({ canActivate, activating, onActivate }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <CheckCircle2 className="h-5 w-5" />
          Final Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-2 text-xs">
        <Button
          type="button"
          disabled={!canActivate || activating}
          onClick={onActivate}
          className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold text-base"
        >
          {activating ? 'Activating stay…' : 'Activate Stay & Check-in'}
        </Button>
        {!canActivate && (
          <p className="text-amber-200 text-[11px] text-center">
            Select a reservation, confirm arrival, and capture signature before activating.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

