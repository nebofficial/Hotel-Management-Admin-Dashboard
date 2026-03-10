'use client'

import dynamic from 'next/dynamic'

const CommissionSetup = dynamic(
  () => import('@/components/hrStaff/commissionSetup/CommissionSetup').then((m) => m.default || m),
  { ssr: false },
)

export default function CommissionSetupPage() {
  return <CommissionSetup />
}

