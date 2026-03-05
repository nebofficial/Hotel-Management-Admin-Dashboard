import { Plug, Link2 } from "lucide-react"
import Footer from "@/components/Footer" // Import the Footer component

export const metadata = {
  title: "Integration Settings - Hotel Management System",
  description: "Connect and configure third-party services and APIs.",
}

export default function IntegrationSettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Integration Settings</h1>
            <p className="text-foreground/70 text-sm">Connect third-party services and APIs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "OTA Integration", desc: "Connect with booking platforms" },
              { title: "Email Service", desc: "Configure email service provider" },
              { title: "SMS Gateway", desc: "Setup SMS service provider" },
              { title: "Accounting Software", desc: "Integrate with accounting tools" },
              { title: "Channel Manager", desc: "Connect with channel manager" },
              { title: "Custom API", desc: "Setup custom API endpoints" },
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
