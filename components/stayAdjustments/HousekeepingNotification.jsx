'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BellRing } from 'lucide-react'

export default function HousekeepingNotification({ disabled, notifying, onNotify }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-600 via-rose-500 to-pink-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <BellRing className="h-5 w-5" />
          Housekeeping Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-2">
        <p className="text-white/80 text-[11px]">
          Notify housekeeping about early check-in / late check-out so cleaning schedules can be adjusted.
        </p>
        <Button
          type="button"
          disabled={disabled || notifying}
          onClick={onNotify}
          className="w-full h-9 bg-white text-red-600 hover:bg-rose-50 font-semibold text-xs"
        >
          {notifying ? 'Notifying…' : 'Notify Housekeeping'}
        </Button>
      </CardContent>
    </Card>
  )
}

