import { DashboardOverview } from "@/components/dashboard-overview"

export default function ReportsPage() {
  const metrics = [
    { label: "Avg Occupancy", value: "87.5%", change: "+5.2%", trend: "up" as const },
    { label: "Total Revenue (Month)", value: "$245,680", change: "+18.5%", trend: "up" as const },
    { label: "Avg Daily Rate", value: "$185.40", change: "+$12.50", trend: "up" as const },
    { label: "RevPAR", value: "$162.18", change: "+$15.80", trend: "up" as const },
  ]

  const chartData = [
    { name: "Week 1", value: 52000 },
    { name: "Week 2", value: 58000 },
    { name: "Week 3", value: 61000 },
    { name: "Week 4", value: 74680 },
  ]

  return (
    <main className="p-4">
      <DashboardOverview
        title="Reports"
        description="View comprehensive reports on occupancy, revenue, sales, expenses, and performance"
        metrics={metrics}
        chartData={chartData}
        chartType="line"
      />
    </main>
  )
}
