'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GroupBookingsCard({ count = 0 }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-emerald-900">Group Bookings</CardTitle>
        <p className="text-xs text-emerald-700">Summary</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold text-emerald-900">{Number(count || 0).toLocaleString()}</div>
        <p className="text-xs text-emerald-700">
          Group booking detection is currently basic. If you want, we can add a dedicated group id later.
        </p>
      </CardContent>
    </Card>
  )
}

