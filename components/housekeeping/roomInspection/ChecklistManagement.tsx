import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type ChecklistStatus = "Passed" | "Needs Attention" | "Failed" | "Pending"

export interface InspectionChecklist {
  [key: string]: ChecklistStatus
}

export interface ChecklistInspection {
  id: string
  roomNumber: string
  scheduledDate: string
  inspector: string
  status: string
  checklist?: InspectionChecklist | null
}

interface ChecklistManagementProps {
  inspections: ChecklistInspection[]
  activeInspectionId: string | null
  onSelectInspection: (id: string) => void
  onUpdateChecklist: (id: string, checklist: InspectionChecklist) => Promise<void> | void
  saving: boolean
}

const DEFAULT_KEYS = ["cleanliness", "maintenance", "amenities", "linen"]

export function ChecklistManagement({
  inspections,
  activeInspectionId,
  onSelectInspection,
  onUpdateChecklist,
  saving,
}: ChecklistManagementProps) {
  const active = inspections.find((i) => i.id === activeInspectionId) || inspections[0]
  const currentId = active?.id || null

  const rawChecklist = (active?.checklist || {}) as InspectionChecklist
  const mergedKeys = Array.from(
    new Set([...DEFAULT_KEYS, ...Object.keys(rawChecklist || {})]),
  )

  const getLabel = (key: string) => {
    if (!key) return ""
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
  }

  const handleChange = (key: string, value: ChecklistStatus) => {
    if (!currentId) return
    const next: InspectionChecklist = {
      ...rawChecklist,
      [key]: value,
    }
    onUpdateChecklist(currentId, next)
  }

  const statusColor = (v: ChecklistStatus) => {
    if (v === "Passed") return "bg-emerald-50 text-emerald-700"
    if (v === "Needs Attention") return "bg-amber-50 text-amber-700"
    if (v === "Failed") return "bg-rose-50 text-rose-700"
    return "bg-slate-50 text-slate-600"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
        <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Checklist management
          </CardTitle>
          {active && (
            <p className="text-[11px] text-slate-500">
              Room {active.roomNumber} • {active.inspector} • {active.scheduledDate}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {!active ? (
            <p className="text-xs text-slate-500">
              Select an inspection from the list to manage its checklist.
            </p>
          ) : (
            <div className="space-y-2">
              {mergedKeys.map((key) => {
                const value = (rawChecklist?.[key] || "Pending") as ChecklistStatus
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-900">
                        {getLabel(key)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Mark this item as Passed, Needs Attention, or Failed based on
                        inspection.
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge className={`text-[10px] ${statusColor(value)}`}>{value}</Badge>
                      <select
                        aria-label={`Update ${key} status`}
                        value={value}
                        disabled={saving}
                        onChange={(e) =>
                          handleChange(key, e.target.value as ChecklistStatus)
                        }
                        className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700"
                      >
                        <option value="Passed">Passed</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Failed">Failed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Inspections list
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-1.5 text-xs">
          {inspections.length === 0 ? (
            <p className="text-slate-500 text-xs">No inspections scheduled yet.</p>
          ) : (
            inspections.slice(0, 20).map((i) => (
              <Button
                key={i.id}
                variant={i.id === currentId ? "secondary" : "outline"}
                size="sm"
                className="w-full justify-between px-2 py-1 h-auto text-[11px] mb-1"
                onClick={() => onSelectInspection(i.id)}
              >
                <span className="truncate mr-1">
                  Room {i.roomNumber} • {i.inspector}
                </span>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {i.scheduledDate}
                </span>
              </Button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

