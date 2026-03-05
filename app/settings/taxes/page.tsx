import { BarChart3, DollarSign } from "lucide-react"
import Footer from "@/components/Footer" // Assuming Footer is a component that needs to be imported

export const metadata = {
  title: "Taxes & Charges - Hotel Management System",
  description: "Configure GST, VAT, service charges, and other tax settings.",
}

export default function TaxesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Taxes & Charges</h1>
            <p className="text-foreground/70 text-sm">Configure GST, VAT, and service charges for your hotel</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "GST Configuration", desc: "Set up GST rates and slabs" },
              { title: "VAT Setup", desc: "Configure VAT percentages" },
              { title: "Service Charge", desc: "Set service charge percentages" },
              { title: "Room Tax", desc: "Configure room specific taxes" },
              { title: "F&B Tax", desc: "Set food and beverage tax rates" },
              { title: "Tax Exemptions", desc: "Manage tax exemption rules" },
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
