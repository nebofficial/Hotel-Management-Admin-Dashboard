'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

interface Props {
  kots: KitchenKOT[]
  onRefresh: () => void
}

export default function PreparationTimeTracking({ kots, onRefresh }: Props) {
  const calculatePrepTime = (kot: KitchenKOT) => {
    if (!kot.preparationStartTime) return null
    const start = new Date(kot.preparationStartTime)
    const end = kot.preparationEndTime ? new Date(kot.preparationEndTime) : new Date()
    const minutes = Math.floor((end.getTime() - start.getTime()) / 60000)
    return minutes
  }

  const kotsWithTime = kots.filter((kot) => kot.preparationStartTime || kot.preparationEndTime)

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Orders with time tracking
            </div>
            <div className="text-lg font-semibold">
              {kotsWithTime.length.toString().padStart(2, "0")}
            </div>
          </div>
          <Clock className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Track item preparation time
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {kotsWithTime.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No preparation time data yet. Time tracking starts when order status changes to "Preparing".
              </div>
            ) : (
              kotsWithTime.map((kot) => {
                const prepTime = calculatePrepTime(kot)
                const estimated = kot.estimatedTime
                return (
                  <div
                    key={kot.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-900 font-mono">{kot.kotNumber}</span>
                      <Badge className={`border text-[10px] ${kot.status === "Preparing" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-green-100 text-green-700 border-green-200"}`}>
                        {kot.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <div>Table {kot.tableNo} • {kot.items.length} items</div>
                      {kot.preparationStartTime && (
                        <div>Started: {new Date(kot.preparationStartTime).toLocaleTimeString()}</div>
                      )}
                      {kot.preparationEndTime && (
                        <div>Completed: {new Date(kot.preparationEndTime).toLocaleTimeString()}</div>
                      )}
                      {prepTime !== null && (
                        <div className="font-semibold text-amber-700">
                          Prep time: {prepTime} min{estimated && ` (Est: ${estimated} min)`}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
