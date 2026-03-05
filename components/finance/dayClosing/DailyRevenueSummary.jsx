'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DailyRevenueSummary({ revenue }) {
  const { roomRevenue = 0, restaurantRevenue = 0, otherIncome = 0, totalRevenue = 0 } = revenue || {}

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-green-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Daily Revenue Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold">
          ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/15 rounded-lg p-2">
            <p className="text-emerald-100">Room</p>
            <p className="font-semibold">
              ${roomRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/15 rounded-lg p-2">
            <p className="text-emerald-100">Restaurant</p>
            <p className="font-semibold">
              ${restaurantRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/15 rounded-lg p-2">
            <p className="text-emerald-100">Other</p>
            <p className="font-semibold">
              ${otherIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

