import { DashboardOverview } from "@/components/dashboard-overview"

export default function HelpPage() {
  const metrics = [
    { label: "Open Support Tickets", value: "8", change: "-2", trend: "down" as const },
    { label: "Avg Response Time", value: "45 min", change: "-15 min", trend: "up" as const },
    { label: "FAQ Views", value: "1,245", change: "+328", trend: "up" as const },
    { label: "System Uptime", value: "99.8%", change: "Excellent", trend: "up" as const },
  ]

  const chartData = [
    { name: "Week 1", value: 12 },
    { name: "Week 2", value: 8 },
    { name: "Week 3", value: 10 },
    { name: "Week 4", value: 8 },
  ]

  return (
    <main className="p-4">
      <DashboardOverview
        title="Help"
        description="Access user guides, support tickets, activity logs, and system information"
        metrics={metrics}
        chartData={chartData}
        chartType="line"
      />
    </main>
  )
}
