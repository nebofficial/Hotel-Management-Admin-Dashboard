"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Boxes, ExternalLink } from "lucide-react"

export interface InventoryLinkTask {
  id: string
  loadNumber: string
  itemType: string
  quantity: number
  status: string
}

interface InventoryLinkProps {
  tasks: InventoryLinkTask[]
}

export function InventoryLink({ tasks }: InventoryLinkProps) {
  const completedToday = tasks.filter(
    (t) => t.status === "Completed" && new Date().toISOString().slice(0, 10) === t.scheduledDate,
  )

  const byItemType = new Map<string, number>()
  completedToday.forEach((t) => {
    const current = byItemType.get(t.itemType) || 0
    byItemType.set(t.itemType, current + t.quantity)
  })

  const summary = Array.from(byItemType.entries()).map(([type, qty]) => ({
    type,
    quantity: qty,
  }))

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Boxes className="h-4 w-4 text-emerald-600" />
          Linen inventory link
        </CardTitle>
        <Link
          href="/housekeeping/linen"
          className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Open inventory <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs space-y-3">
        <p className="text-slate-600">
          Completed laundry loads today can be added back to linen inventory stock. Review
          quantities below and update inventory levels accordingly.
        </p>

        {summary.length === 0 ? (
          <p className="text-slate-500 text-xs">No completed loads today.</p>
        ) : (
          <div className="space-y-1.5">
            {summary.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 border border-slate-100"
              >
                <span className="font-medium text-slate-900">{item.type}</span>
                <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">
                  +{item.quantity} items ready
                </Badge>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 mb-2">
            Quick actions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href="/housekeeping/linen"
              className="text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100"
            >
              Update stock levels
            </Link>
            <Link
              href="/housekeeping/schedule"
              className="text-[11px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
            >
              View cleaning schedule
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
