'use client'

import dynamic from 'next/dynamic'

const AttendancePage = dynamic(
  () => import('@/components/hrStaff/attendance/AttendancePage').then((m) => m.default || m),
  { ssr: false },
)

export default function StaffAttendancePage() {
  return <AttendancePage />
}

