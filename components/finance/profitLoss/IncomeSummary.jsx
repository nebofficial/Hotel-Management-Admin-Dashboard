'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IncomeSummary({ income }) {
  const room = Number(income?.roomIncome || 0)
  const restaurant = Number(income?.restaurantIncome || 0)
  const bar = Number(income?.barIncome || 0)
  const total = Number(income?.totalIncome || room + restaurant + bar)

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-green-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Income Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-bold">
          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-emerald-100 text-xs">Total Income (Rooms + Restaurant + Bar)</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-emerald-100">Rooms</p>
            <p className="font-semibold">
              ₹{room.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-emerald-100">Restaurant</p>
            <p className="font-semibold">
              ₹{restaurant.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-emerald-100">Bar / Other</p>
            <p className="font-semibold">
              ₹{bar.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

