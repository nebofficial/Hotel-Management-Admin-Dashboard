import { RefreshCw, AlertCircle } from "lucide-react"
import Footer from "@/components/Footer" // Declare the Footer component

export const metadata = {
  title: "System Updates - Hotel Management System",
  description: "Check for and install system updates.",
}

export default function SystemUpdatesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">System Updates</h1>
            <p className="text-foreground/70 text-sm">Check and install system updates</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "Check Updates", desc: "Check for available updates" },
              { title: "Update History", desc: "View previous updates" },
              { title: "Auto Updates", desc: "Enable automatic updates" },
              { title: "Changelog", desc: "View update release notes" },
              { title: "Update Settings", desc: "Configure update preferences" },
              { title: "System Version", desc: "Check current system version" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border-2 border-accent/20 hover:border-accent transition-colors">
                <h3 className="text-sm font-bold text-primary mb-1">{item.title}</h3>
                <p className="text-foreground/70 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
