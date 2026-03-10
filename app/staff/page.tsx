"use client"

import dynamic from "next/dynamic"

const HRDashboard = dynamic(
  () => import("@/components/hrStaff/dashboard/HRDashboard").then((m) => m.default ?? m),
  { ssr: false },
)

export default function StaffPage() {
  return (
    <main className="min-h-screen">
      <HRDashboard />
    </main>
  )
}
