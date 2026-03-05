import { FileText, Layout } from "lucide-react"
import Footer from "@/components/Footer" // Import the Footer component

export const metadata = {
  title: "Invoice Templates - Hotel Management System",
  description: "Customize invoice and bill templates for your hotel.",
}

export default function InvoiceTemplatesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Invoice Templates</h1>
            <p className="text-foreground/70 text-sm">Create and customize invoice and bill templates</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "Room Invoice", desc: "Customize room bill template" },
              { title: "Restaurant Invoice", desc: "Customize F&B invoice template" },
              { title: "Combined Invoice", desc: "Customize combined bill layout" },
              { title: "Invoice Header", desc: "Set header and logo" },
              { title: "Invoice Footer", desc: "Configure footer details" },
              { title: "Template Variables", desc: "Manage dynamic template fields" },
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
