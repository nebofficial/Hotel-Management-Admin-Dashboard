import { CreditCard, DollarSign, Wallet } from "lucide-react"
import Footer from "@/components/Footer"; // Declare the Footer component

export const metadata = {
  title: "Payment Methods - Hotel Management System",
  description: "Configure and manage payment gateways and payment methods.",
}

export default function PaymentMethodsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Payment Methods</h1>
            <p className="text-foreground/70 text-sm">Set up and manage payment gateways and methods</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "Credit / Debit Card", desc: "Configure card payment gateway" },
              { title: "Online Payment", desc: "Setup online payment processors" },
              { title: "Cash Payment", desc: "Enable cash payment tracking" },
              { title: "Cheque Payment", desc: "Configure cheque payment handling" },
              { title: "Bank Transfer", desc: "Setup bank transfer details" },
              { title: "Digital Wallets", desc: "Enable digital wallet payments" },
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
