import { Navbar } from "@/components/navbar"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
export const metadata = {
  title: "Settings - Hotel Management System",
  description: "Configure hotel settings, payment methods, taxes, and system preferences.",
}

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-red-900 text-white py-6 md:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">System Settings</h1>
          <p className="text-sm md:text-base text-amber-100">Manage hotel configuration and preferences</p>
        </div>
      </section>

      {/* Settings Grid */}
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "Hotel Profile", desc: "Update hotel information and details" },
              { title: "Check-in / Check-out Rules", desc: "Define guest arrival and departure policies" },
              { title: "Currency & Language", desc: "Set system currency and language preferences" },
              { title: "Taxes & Charges", desc: "Configure GST, VAT, and service charges" },
              { title: "Payment Methods", desc: "Set up payment gateways and methods" },
              { title: "Invoice Templates", desc: "Customize invoice and bill templates" },
              { title: "POS Settings", desc: "Configure restaurant POS system" },
              { title: "Integration Settings", desc: "Connect third-party services and APIs" },
              { title: "System Themes", desc: "Customize dashboard appearance" },
            ].map((setting, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 border-2 border-accent/20 hover:border-accent transition-colors cursor-pointer hover:shadow-lg"
              >
                <h3 className="text-sm font-bold text-primary mb-1">{setting.title}</h3>
                <p className="text-foreground/70 text-xs">{setting.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
