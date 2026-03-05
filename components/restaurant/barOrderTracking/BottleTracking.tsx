'use client'

import { useMemo } from "react"
import type { BarInventoryItem } from "./BarOrderTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets } from "lucide-react"

interface Props {
  items: BarInventoryItem[]
}

export default function BottleTracking({ items }: Props) {
  const alcohol = useMemo(() => items.filter((i) => i.isAlcohol), [items])

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Bottle Tracking
            <Badge className="bg-white/15 text-white border-none">
              Visual counter
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Progress bars show approximate bottle usage. Works best when stock is
          tracked in ml and bottle size is set.
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {alcohol.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm sm:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center text-sm text-slate-500">
              No alcohol inventory items found.
            </CardContent>
          </Card>
        ) : (
          alcohol.map((it) => {
            const bottle = Number(it.bottleSizeMl || 0)
            const stock = Number(it.currentStock || 0)
            const pct =
              bottle > 0 ? Math.max(0, Math.min(100, (stock / bottle) * 100)) : 0
            const low = it.currentStock <= it.reorderLevel

            return (
              <Card
                key={it.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center justify-between gap-2">
                    <span className="truncate">{it.name}</span>
                    <Badge
                      className={`border ${
                        low
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {low ? "Low" : "OK"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="text-xs text-slate-500">
                    Stock: {stock} {it.unit || "ml"} • Bottle:{" "}
                    {bottle ? `${bottle} ml` : "Not set"}
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-violet-600"
                      style={{ width: `${pct.toFixed(0)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Approx fullness</span>
                    <span className="font-medium text-slate-700">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </section>
  )
}

