'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancellationToday({ count = 0 }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-red-900">Cancellations Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold text-red-900">{Number(count || 0).toLocaleString()}</div>
        <p className="text-xs text-red-700">Tracks bookings cancelled in the selected period.</p>
      </CardContent>
    </Card>
  )
}

