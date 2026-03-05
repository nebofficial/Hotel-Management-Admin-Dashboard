'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function NoShowMarker({ value, onChange, onMark, processing }) {
  const v = value || {}
  const set = (patch) => onChange?.({ ...v, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <AlertTriangle className="h-5 w-5" />
          No-Show Management
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-3">
        <p className="text-[11px] text-amber-100">
          Use this if the guest never arrived. Depending on policy, one night may be retained as a no-show fee and the
          room will be released.
        </p>
        <div>
          <Label className="text-white/90">Reason</Label>
          <Input
            value={v.reason || ''}
            onChange={(e) => set({ reason: e.target.value })}
            className="mt-1 bg-white/15 text-white border-white/20 h-9"
            placeholder="Reason for marking no-show (optional)"
          />
        </div>
        <Button
          type="button"
          disabled={processing}
          onClick={() => onMark?.(v)}
          className="w-full h-9 bg-white text-orange-700 hover:bg-orange-50 font-semibold text-xs"
        >
          {processing ? 'Marking…' : 'Mark as No-Show'}
        </Button>
      </CardContent>
    </Card>
  )
}

