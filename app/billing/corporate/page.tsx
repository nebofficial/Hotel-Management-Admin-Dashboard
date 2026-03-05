'use client'

import dynamic from 'next/dynamic'

const CorporateBilling = dynamic(
  () => import('@/components/billing/corporateBilling/CorporateBilling').then((m) => m.default || m),
  { ssr: false },
)

export default function LegacyCorporateBillingPage() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Corporate Billing</h2>
      <CorporateBilling />
    </div>
  )
}
