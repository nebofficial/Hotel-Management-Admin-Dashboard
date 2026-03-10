'use client'

import dynamic from 'next/dynamic'

const ShiftManagementPage = dynamic(
  () => import('@/components/hrStaff/shiftManagement/ShiftManagementPage').then((m) => m.default || m),
  { ssr: false },
)

export default function StaffShiftManagementPage() {
  return <ShiftManagementPage />
}
