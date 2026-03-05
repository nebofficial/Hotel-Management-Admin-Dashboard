import { Palette, Eye } from "lucide-react"
import Footer from "@/components/Footer"; // Declare the Footer variable before using it

export const metadata = {
  title: "Themes - Hotel Management System",
  description: "Customize the appearance and theme of your dashboard.",
}

export default function ThemesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Themes</h1>
            <p className="text-foreground/70 text-sm">Customize dashboard appearance and themes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "Color Scheme", desc: "Customize primary and accent colors" },
              { title: "Dark Mode", desc: "Enable or disable dark theme" },
              { title: "Font Settings", desc: "Choose fonts and typography" },
              { title: "Logo Upload", desc: "Upload custom hotel logo" },
              { title: "Sidebar Theme", desc: "Customize sidebar appearance" },
              { title: "Button Styles", desc: "Customize button appearance" },
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
