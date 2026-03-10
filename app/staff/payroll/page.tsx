'use client'

import dynamic from 'next/dynamic'

const PayrollPage = dynamic(
  () => import('@/components/hrStaff/payroll/PayrollPage').then((m) => m.default || m),
  { ssr: false },
)

export default function StaffPayrollPage() {
  return <PayrollPage />
}
