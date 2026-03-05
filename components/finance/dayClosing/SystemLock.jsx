'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export default function SystemLock({ locked, onLock }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-slate-50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Lock className="h-4 w-4" />
          System Lock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-xs text-slate-200">
          {locked
            ? 'Day closed successfully. Further add/edit/delete for this date is locked.'
            : 'Locking will prevent add/edit/delete for this date. Only admin can unlock in the backend.'}
        </p>
        <Button
          size="sm"
          disabled={locked}
          onClick={onLock}
          className="w-full bg-amber-500 hover:bg-amber-600 text-sm"
        >
          {locked ? 'Day Locked' : 'Lock Day'}
        </Button>
      </CardContent>
    </Card>
  )
}

