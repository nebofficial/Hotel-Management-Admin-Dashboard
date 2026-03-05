import { DashboardOverview } from "@/components/dashboard-overview"

export default function SettingsPage() {
  const metrics = [
    { label: "Active Integrations", value: "8", change: "+2", trend: "up" as const },
    { label: "User Accounts", value: "32", change: "+1", trend: "up" as const },
    { label: "Last Backup", value: "2h ago", change: "On Time", trend: "up" as const },
    { label: "System Health", value: "98.5%", change: "Excellent", trend: "up" as const },
  ]

  const chartData = [
    { name: "API Calls", value: 15000 },
    { name: "Database Size", value: 8500 },
    { name: "Active Sessions", value: 145 },
  ]

  return (
    <main className="p-4">
      <DashboardOverview
        title="Settings"
        description="Configure hotel profile, system settings, payment methods, and integrations"
        metrics={metrics}
        chartData={chartData}
        chartType="bar"
      />
    </main>
  )
}
