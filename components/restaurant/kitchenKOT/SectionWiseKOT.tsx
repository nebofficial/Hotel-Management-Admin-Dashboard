'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UtensilsCrossed } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

interface Props {
  kots: KitchenKOT[]
  onRefresh: () => void
}

const SECTIONS = ["Grill", "Tandoor", "Bakery", "Main", "Salad", "Beverage", "All"]

export default function SectionWiseKOT({ kots, onRefresh }: Props) {
  const sectionGroups: Record<string, KitchenKOT[]> = {}
  SECTIONS.forEach((section) => {
    sectionGroups[section] = []
  })
  sectionGroups["Other"] = []

  kots.forEach((kot) => {
    const section = kot.section || "Other"
    if (sectionGroups[section]) {
      sectionGroups[section].push(kot)
    } else {
      sectionGroups["Other"].push(kot)
    }
  })

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Section-wise KOTs
            </div>
            <div className="text-lg font-semibold">
              {Object.keys(sectionGroups).filter((s) => sectionGroups[s].length > 0).length} sections
            </div>
          </div>
          <UtensilsCrossed className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      {SECTIONS.concat(["Other"]).map((section) => {
        const sectionKOTs = sectionGroups[section] || []
        if (sectionKOTs.length === 0) return null

        return (
          <Card key={section} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                {section} ({sectionKOTs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                {sectionKOTs.map((kot) => (
                  <div
                    key={kot.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-900 font-mono">{kot.kotNumber}</span>
                        <Badge className={`border text-[10px] ${kot.status === "Pending" ? "bg-blue-100 text-blue-700 border-blue-200" : kot.status === "Preparing" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-green-100 text-green-700 border-green-200"}`}>
                          {kot.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Table {kot.tableNo} • {kot.items.length} items
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
