'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancellationPolicyPanel({ policy }) {
  if (!policy) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Cancellation Policy</CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/80 text-sm text-center py-4">
            Select a reservation to view the applicable cancellation policy.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { policyType, hoursBeforeCheckIn, nightlyRate } = policy

  const describePolicy = () => {
    if (policyType === 'free_before_48h') {
      return 'Free cancellation if more than 48 hours before check-in.'
    }
    if (policyType === 'half_day_retention') {
      return '50% of one night will be charged as cancellation fee.'
    }
    if (policyType === 'one_night_retention') {
      return 'One night room charge will be retained as cancellation fee.'
    }
    if (policyType === 'late_cancellation') {
      return 'Late cancellation / no-show – one night charge will be retained.'
    }
    return 'Flexible cancellation policy.'
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Cancellation Policy</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-white/80">Policy Type</span>
          <span className="font-semibold text-sm">{policyType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/80">Hours before check-in</span>
          <span className="font-semibold text-sm">{hoursBeforeCheckIn.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/80">Nightly rate (approx)</span>
          <span className="font-semibold text-sm">₹{Number(nightlyRate || 0).toFixed(2)}</span>
        </div>
        <hr className="border-white/20" />
        <p className="text-[11px] text-blue-100">{describePolicy()}</p>
      </CardContent>
    </Card>
  )
}

