import { Navbar } from "@/components/navbar"
import { Award, Users, Heart, Globe } from "lucide-react"
export const metadata = {
  title: "Reports - Hotel Management System",
  description: "Access comprehensive reports including occupancy, revenue, expenses, and staff performance.",
}

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-red-900 text-white py-6 md:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">Reports & Analytics</h1>
          <p className="text-sm md:text-base text-amber-100">Comprehensive Business Intelligence & Insights</p>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "Occupancy Report", desc: "Room availability and occupancy metrics" },
              { title: "Revenue Report", desc: "Daily, weekly, and monthly revenue analysis" },
              { title: "Room Revenue", desc: "Room-wise revenue breakdown" },
              { title: "Restaurant Sales", desc: "F&B sales and performance tracking" },
              { title: "Tax Report", desc: "GST, VAT, and service charge reports" },
              { title: "Expense Report", desc: "Operating expenses and cost analysis" },
              { title: "Inventory Report", desc: "Stock levels and inventory status" },
              { title: "Staff Performance", desc: "Employee productivity metrics" },
              { title: "Audit Logs", desc: "System activity and transaction history" },
            ].map((report, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 border-2 border-accent/20 hover:border-accent transition-colors cursor-pointer hover:shadow-lg"
              >
                <h3 className="text-sm font-bold text-primary mb-1">{report.title}</h3>
                <p className="text-foreground/70 text-xs">{report.desc}</p>
              </div>
            ))}
          </div>
        </div>
  </section>
    </main>
  )
}
