'use client'

import dynamic from 'next/dynamic'

const RolesPermissionsPage = dynamic(
  () => import('@/components/hrStaff/rolesPermissions/RolesPermissionsPage').then((m) => m.default || m),
  { ssr: false },
)

export default function StaffRolesPermissionsPage() {
  return <RolesPermissionsPage />
}

