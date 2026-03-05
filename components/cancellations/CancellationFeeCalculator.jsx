'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancellationFeeCalculator({ policy }) {
  if (!policy) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Cancellation Fee</CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/80 text-sm text-center py-4">
            Policy-based fee and refund amount will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const format = (v) => `₹${Number(v || 0).toFixed(2)}`

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Cancellation Fee</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-white/80">Advance Paid</span>
          <span className="font-semibold text-sm">{format(policy.advancePaid)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/80">Cancellation Fee</span>
          <span className="font-semibold text-sm">{format(policy.cancellationFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/80">Refundable Amount</span>
          <span className="font-semibold text-sm">{format(policy.refundableAmount)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

