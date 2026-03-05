import { Zap, Settings2 } from "lucide-react"
import Footer from "@/components/Footer" // Declare the Footer variable

export const metadata = {
  title: "POS Settings - Hotel Management System",
  description: "Configure point of sale system settings and features.",
}

export default function POSSettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">POS Settings</h1>
            <p className="text-foreground/70 text-sm">Configure point of sale system and hardware</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "POS Terminals", desc: "Manage POS terminal configuration" },
              { title: "Printer Setup", desc: "Configure receipt printer settings" },
              { title: "Barcode Scanner", desc: "Setup barcode scanner configuration" },
              { title: "Payment Terminal", desc: "Configure payment terminal settings" },
              { title: "Kitchen Display", desc: "Setup kitchen display system" },
              { title: "POS Shortcuts", desc: "Define quick access keys and shortcuts" },
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
