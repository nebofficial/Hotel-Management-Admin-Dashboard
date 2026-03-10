"use client"

import Link from "next/link"
import { FileText, BarChart3, Megaphone, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"

const LINKS = [
  { label: "Property Revenue Report", href: "/reports/revenue", icon: FileText },
  { label: "Occupancy Report", href: "/reports/occupancy", icon: BarChart3 },
  { label: "Marketing Performance", href: "/marketing/dashboard", icon: Megaphone },
  { label: "Operational Reports", href: "/reports", icon: ClipboardList },
]

export function PropertyReportsQuickAccess() {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-md">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
        Quick Access to Property Reports
      </h3>
      <div className="flex flex-wrap gap-2">
        {LINKS.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button variant="outline" size="sm" className="flex items-center gap-2 border-slate-300 bg-white hover:bg-slate-50">
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
