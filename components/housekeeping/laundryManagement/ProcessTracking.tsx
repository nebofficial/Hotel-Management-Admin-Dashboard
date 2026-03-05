"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WashingMachine, Droplet, Sparkles, FoldHorizontal } from "lucide-react"

export type LaundryStatus = "Pending" | "Washing" | "Drying" | "Ironing" | "Folding" | "Completed"

export interface ProcessTrackingTask {
  id: string
  loadNumber: string
  itemType: string
  quantity: number
  status: LaundryStatus
  assignedTo: string | null
}

interface ProcessTrackingProps {
  tasks: ProcessTrackingTask[]
  onUpdateStatus: (id: string, status: LaundryStatus) => Promise<void> | void
  saving: boolean
}

const STATUS_FLOW: LaundryStatus[] = ["Pending", "Washing", "Drying", "Ironing", "Folding", "Completed"]

const STATUS_ICONS = {
  Pending: null,
  Washing: WashingMachine,
  Drying: Droplet,
  Ironing: Sparkles,
  Folding: FoldHorizontal,
  Completed: null,
}

const STATUS_COLORS = {
  Pending: "bg-slate-100 text-slate-800",
  Washing: "bg-blue-100 text-blue-800",
  Drying: "bg-cyan-100 text-cyan-800",
  Ironing: "bg-amber-100 text-amber-800",
  Folding: "bg-purple-100 text-purple-800",
  Completed: "bg-emerald-100 text-emerald-800",
}

export function ProcessTracking({ tasks, onUpdateStatus, saving }: ProcessTrackingProps) {
  const activeTasks = tasks.filter((t) => t.status !== "Completed")

  const getNextStatus = (current: LaundryStatus): LaundryStatus | null => {
    const idx = STATUS_FLOW.indexOf(current)
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null
  }

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-900">
          Process tracking ({activeTasks.length} active)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-xs md:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Load</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Item type</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Quantity</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Assigned to</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-500">
                    No active laundry tasks.
                  </td>
                </tr>
              ) : (
                activeTasks.map((t) => {
                  const nextStatus = getNextStatus(t.status)
                  const Icon = STATUS_ICONS[t.status] || null
                  return (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="px-3 py-2 font-medium text-slate-900">{t.loadNumber}</td>
                      <td className="px-3 py-2 text-slate-700">{t.itemType}</td>
                      <td className="px-3 py-2 text-slate-700">{t.quantity}</td>
                      <td className="px-3 py-2">
                        <Badge className={STATUS_COLORS[t.status]} style={{ fontSize: "10px" }}>
                          {Icon && <Icon className="h-3 w-3 inline mr-1" />}
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {t.assignedTo || "Unassigned"}
                      </td>
                      <td className="px-3 py-2">
                        {nextStatus && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[10px] h-6 px-2"
                            disabled={saving}
                            onClick={() => onUpdateStatus(t.id, nextStatus)}
                          >
                            → {nextStatus}
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
