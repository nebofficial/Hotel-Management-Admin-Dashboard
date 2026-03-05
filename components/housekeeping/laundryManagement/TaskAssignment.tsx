"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type AssignmentType = "Staff" | "Vendor"

export interface TaskAssignmentRecord {
  id: string
  loadNumber: string
  itemType: string
  quantity: number
  scheduledDate: string
  assignedTo: string | null
  assignedType: AssignmentType
  status: string
}

interface TaskAssignmentProps {
  tasks: TaskAssignmentRecord[]
  onAssign: (
    id: string,
    updates: { assignedTo: string; assignedType: AssignmentType },
  ) => Promise<void> | void
  saving: boolean
}

export function TaskAssignment({ tasks, onAssign, saving }: TaskAssignmentProps) {
  const unassigned = tasks.filter((t) => !t.assignedTo && t.status !== "Completed")
  const assigned = tasks.filter((t) => t.assignedTo && t.status !== "Completed")

  const handleQuickAssign = async (taskId: string, staffName: string, type: AssignmentType) => {
    await onAssign(taskId, { assignedTo: staffName, assignedType: type })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Unassigned tasks ({unassigned.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs space-y-2">
          {unassigned.length === 0 ? (
            <p className="text-slate-500">All tasks are assigned.</p>
          ) : (
            unassigned.slice(0, 10).map((t) => (
              <div
                key={t.id}
                className="rounded-md bg-amber-50 border border-amber-100 px-3 py-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-slate-900">{t.loadNumber}</span>
                    <p className="text-[11px] text-slate-600">
                      {t.itemType} • {t.quantity} items • {t.scheduledDate}
                    </p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                    {t.status}
                  </Badge>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-6 px-2"
                    disabled={saving}
                    onClick={() => handleQuickAssign(t.id, "Staff Member", "Staff")}
                  >
                    Assign to Staff
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-6 px-2"
                    disabled={saving}
                    onClick={() => handleQuickAssign(t.id, "External Vendor", "Vendor")}
                  >
                    Assign to Vendor
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Assigned tasks ({assigned.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs space-y-2">
          {assigned.length === 0 ? (
            <p className="text-slate-500">No tasks assigned yet.</p>
          ) : (
            assigned.slice(0, 10).map((t) => (
              <div
                key={t.id}
                className="rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-slate-900">{t.loadNumber}</span>
                    <p className="text-[11px] text-slate-600">
                      {t.itemType} • {t.quantity} items
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Assigned to: {t.assignedTo} ({t.assignedType})
                    </p>
                  </div>
                  <Badge
                    className={
                      t.assignedType === "Staff"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }
                    style={{ fontSize: "10px" }}
                  >
                    {t.assignedType}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
