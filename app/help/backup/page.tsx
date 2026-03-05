import { HardDrive, Download } from "lucide-react"
import Footer from "@/components/Footer" // Declare the Footer component

export const metadata = {
  title: "Backup & Restore - Hotel Management System",
  description: "Manage database backups and restore functionality.",
}

export default function BackupPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Backup & Restore</h1>
            <p className="text-foreground/70 text-sm">Manage database backups and system recovery</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "Create Backup", desc: "Create manual database backup" },
              { title: "Scheduled Backups", desc: "Setup automatic backup schedule" },
              { title: "Backup History", desc: "View and manage backup files" },
              { title: "Restore Database", desc: "Restore from backup file" },
              { title: "Cloud Backup", desc: "Enable cloud backup storage" },
              { title: "Backup Settings", desc: "Configure backup retention policy" },
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
