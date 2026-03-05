'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HourlyRateCalculator({ summary }) {
  if (!summary) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Hourly Rate Calculation</CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/80 text-sm text-center py-4">
            Adjust requested times to calculate early / late charges.
          </p>
        </CardContent>
      </Card>
    )
  }

  const format = (v) => Number(v || 0).toFixed(2)

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Hourly Rate Calculation</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-white/80">Hourly Rate</div>
            <div className="font-semibold text-sm">₹{format(summary.hourlyRate)}</div>
          </div>
          <div>
            <div className="text-white/80">Nightly Rate</div>
            <div className="font-semibold text-sm">₹{format(summary.nightlyRate)}</div>
          </div>
          <div>
            <div className="text-white/80">Early Hours</div>
            <div className="font-semibold text-sm">{format(summary.earlyHours)}</div>
          </div>
          <div>
            <div className="text-white/80">Early Charge</div>
            <div className="font-semibold text-sm">₹{format(summary.earlyCharge)}</div>
          </div>
          <div>
            <div className="text-white/80">Late Hours</div>
            <div className="font-semibold text-sm">{format(summary.lateHours)}</div>
          </div>
          <div>
            <div className="text-white/80">Late Charge</div>
            <div className="font-semibold text-sm">₹{format(summary.lateCharge)}</div>
          </div>
        </div>
        <hr className="border-white/20" />
        <div className="flex items-center justify-between">
          <div className="text-white/80">Total Extra Charge</div>
          <div className="font-bold text-lg">₹{format(summary.totalExtraCharge)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

