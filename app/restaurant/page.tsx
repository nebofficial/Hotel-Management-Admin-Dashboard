import { DashboardOverview } from "@/components/dashboard-overview"

export default function RestaurantPage() {
  const metrics = [
    { label: "Today's Sales", value: "$8,750", change: "+15.3%", trend: "up" as const },
    { label: "Covers Served", value: "234", change: "+28", trend: "up" as const },
    { label: "Avg Check Size", value: "$37.40", change: "+$2.15", trend: "up" as const },
    { label: "Active Tables", value: "18", change: "+3", trend: "up" as const },
  ]

  const chartData = [
    { name: "Breakfast", value: 1200 },
    { name: "Lunch", value: 3400 },
    { name: "Snacks", value: 1800 },
    { name: "Dinner", value: 4200 },
  ]

  return (
    <main className="p-4">
      <DashboardOverview
        title="Restaurant"
        description="Manage billing, table service, menu, orders, and restaurant operations"
        metrics={metrics}
        chartData={chartData}
        chartType="bar"
      />
    </main>
  )
}
