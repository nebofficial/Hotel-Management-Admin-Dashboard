"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WashingMachine } from "lucide-react"

export default function LaundryManagement() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <WashingMachine className="w-4 h-4 text-sky-600" />
          Laundry Management
        </h2>
        <Badge className="bg-sky-50 text-sky-700 border border-sky-100 text-[11px]">
          Coming soon – backend integration
        </Badge>
      </div>
      <Card className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Today&apos;s laundry overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-slate-600 space-y-1">
          <p>
            This section will track loads in progress, completed laundry, pending
            linens, and machine utilization, fully synced with your backend.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

