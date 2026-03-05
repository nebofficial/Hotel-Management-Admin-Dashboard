import { BarChart3, Users, TrendingUp, AlertCircle, Calendar, AlertTriangle } from "lucide-react"
export const metadata = {
  title: "Hotel Manager - Dashboard",
  description: "Hotel management system dashboard with reservations, rooms, and occupancy tracking",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">

      {/* Dashboard Hero */}
      <section className="bg-linear-to-r from-primary to-red-900 text-white py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-balance">Welcome to Hotel Manager</h1>
          <p className="text-sm text-amber-100">Today's Overview & Quick Access</p>
        </div>
      </section>

      {/* KPIs Section */}
      <section className="py-4 md:py-6 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Calendar, label: "Occupancy Rate", value: "78%", color: "bg-green-50 text-green-700" },
              { icon: Users, label: "Guests Today", value: "45", color: "bg-blue-50 text-blue-700" },
              { icon: TrendingUp, label: "Today's Revenue", value: "$8,450", color: "bg-amber-50 text-amber-700" },
              { icon: BarChart3, label: "Bookings Pending", value: "12", color: "bg-rose-50 text-rose-700" },
            ].map((metric, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border-2 border-accent/10 hover:border-accent transition-colors">
                <div className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center mb-2`}>
                  <metric.icon className="w-5 h-5" />
                </div>
                <p className="text-foreground/70 text-xs mb-0.5">{metric.label}</p>
                <p className="text-xl md:text-2xl font-bold text-primary">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-4 md:py-6 bg-accent/5">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "New Reservation", desc: "Create a new guest booking" },
              { title: "Check-In Guest", desc: "Process guest arrival" },
              { title: "Room Assignment", desc: "Assign available rooms" },
              { title: "Housekeeping", desc: "View cleaning schedule" },
              { title: "Billing", desc: "Process guest bills" },
              { title: "Maintenance", desc: "Report maintenance issues" },
            ].map((action, i) => (
              <button
                key={i}
                className="bg-white rounded-lg p-4 border-2 border-accent/20 hover:border-accent transition-colors hover:shadow-lg text-left"
              >
                <h3 className="text-sm font-bold text-primary mb-1">{action.title}</h3>
                <p className="text-foreground/70 text-xs">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Alerts Section */}
      <section className="py-4 md:py-6 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">System Alerts</h2>
          <div className="space-y-2">
            {[
              { type: "warning", msg: "4 rooms need housekeeping inspection" },
              { type: "info", msg: "5 check-ins scheduled for today" },
              { type: "alert", msg: "2 maintenance requests pending" },
            ].map((alert, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-3 border-l-4 border-accent flex items-start gap-3 hover:shadow-md transition-shadow"
              >
                <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-foreground/80 text-sm">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
