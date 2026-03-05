import { DashboardOverview } from "@/components/dashboard-overview"

export default function StaffPage() {
  const metrics = [
    { label: "Total Staff", value: "85", change: "+3", trend: "up" as const },
    { label: "On Duty Today", value: "62", change: "+8", trend: "up" as const },
    { label: "Leave Requests", value: "4", change: "-1", trend: "down" as const },
    { label: "Attendance Rate", value: "91.2%", change: "+2.1%", trend: "up" as const },
  ]

  const chartData = [
    { name: "Front Desk", value: 12 },
    { name: "Housekeeping", value: 28 },
    { name: "Restaurant", value: 22 },
    { name: "Maintenance", value: 8 },
    { name: "Admin", value: 15 },
  ]

  return (
    <main className="p-4">
      <DashboardOverview
        title="Staff"
        description="Manage staff list, roles, attendance, shifts, payroll, and commissions"
        metrics={metrics}
        chartData={chartData}
        chartType="pie"
      />
    </main>
  )
}
