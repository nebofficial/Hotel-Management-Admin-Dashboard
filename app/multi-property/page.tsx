import { DashboardOverview } from "@/components/dashboard-overview"

export default function MultiPropertyPage() {
  const metrics = [
    { label: "Total Properties", value: "5", change: "0", trend: "up" as const },
    { label: "Combined Revenue", value: "$845,320", change: "+22.5%", trend: "up" as const },
    { label: "Avg Occupancy", value: "85.2%", change: "+4.8%", trend: "up" as const },
    { label: "Total Rooms", value: "542", change: "0", trend: "up" as const },
  ]

  const chartData = [
    { name: "Property A", value: 285000 },
    { name: "Property B", value: 245000 },
    { name: "Property C", value: 185000 },
    { name: "Property D", value: 85000 },
    { name: "Property E", value: 45320 },
  ]

  return (
    <main className="p-4">
      <DashboardOverview
        title="Multi-Property"
        description="Manage multiple properties, view central dashboard, and consolidated reports"
        metrics={metrics}
        chartData={chartData}
        chartType="pie"
      />
    </main>
  )
}
