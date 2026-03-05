import { DashboardOverview } from "@/components/dashboard-overview"

export default function MarketingPage() {
  const metrics = [
    { label: "Active Promo Codes", value: "12", change: "+3", trend: "up" as const },
    { label: "Active Campaigns", value: "5", change: "+1", trend: "up" as const },
    { label: "Email Subscribers", value: "3,245", change: "+125", trend: "up" as const },
    { label: "Campaign Click Rate", value: "4.8%", change: "+0.6%", trend: "up" as const },
  ]

  const chartData = [
    { name: "Standard", value: 45000 },
    { name: "Premium", value: 62000 },
    { name: "Deluxe", value: 38000 },
    { name: "Suite", value: 25000 },
  ]

  return (
    <main className="p-4">
      <DashboardOverview
        title="Marketing"
        description="Manage rate plans, seasonal pricing, promo codes, and marketing campaigns"
        metrics={metrics}
        chartData={chartData}
        chartType="bar"
      />
    </main>
  )
}
